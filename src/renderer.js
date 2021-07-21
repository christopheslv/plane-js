import * as mat from './mat4.js';
import animationFrameInstance from './animationframe.js';
import browser from './browser.js';
import { Camera } from './camera.js';
import { Texture } from './texture.js';
import { Shader } from './shader.js';
import { Shape } from './shape.js';

class Framebuffer {
    constructor(gl, width, height) {
        this.gl = gl;
        this.texture = new Texture();
        this.texture.init(this.gl, width, height);
        this.glBuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.glBuffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture.glTexture, 0);
    }
}

class BufferShader extends Shader{
    constructor() {
        super();
    }

    get fragmentShader(){
        return `
            uniform vec2 resolution; 
            uniform sampler2D texture;

            void main( void ){         
                gl_FragColor = texture2D(texture, vec2(gl_FragCoord.x/ resolution.x, gl_FragCoord.y/ resolution.y));
            }
        `;
    }
}

export class Renderer {

    constructor(canvas=null, sceneController) {
        this._canvas = canvas;
        this.gl = null;
        this.width = 0;
        this.height = 0;
        this._density = 1;
        
        this._sceneController = sceneController;
        this._scene = [];
       
        this._camera = null;
        this._mvpMatrix = mat.identity;

        this._isRunning = false;
        this._delayedResizing = null;
        this._bg = [0,0,0,0];
        
        this.init();

        // Double buffering
        this._doubleBuffering = false;
        this._isRenderingToBuffer = false;
        this._buffers = [];
        this._bIndex = 0;
        this._bufferQuad = null;
    }

    init(){
        try {
            this.gl = this._canvas.getContext('webgl');
        } catch( error ) { 
            console.log("Cannot create webGL context");
            return;
        }

        this._camera = new Camera();
        this._camera.setPerspective();
        this._camera.lookAt([0,0,3], [0,0,0], [0,1,0]);

        window.addEventListener('resize', () => this.resize(), false);
        this.resize();
    }

    initBuffers(){
        if(this.doubleBuffering){
            // First frame buffer
            this._buffers[0] = new Framebuffer(this.gl, this.width, this.height);
            this._buffers[1] = new Framebuffer(this.gl, this.width, this.height);
            this._fbIndex = 0;

            if(this._bufferQuad == null ) {
                this._bufferQuad = new Shape();
                this._bufferQuad.shader = new BufferShader();
                this._bufferQuad.init(this.gl);
            }
        }
    }

    bindBuffer(){
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frontBuffer.glBuffer);
    }

    swapBuffers(){
        this._bIndex = 1 - this._bIndex;
    }

    get frontBuffer(){
        return this._buffers[this._bIndex];
    }

    get backBuffer(){
        return this._buffers[1-this._bIndex];
    }

    // Accessors 
    get density(){
        return this._density;
    }

    get canvas(){
        return this._canvas;
    }

    get context(){
        return this.gl;
    }

    get bgColor(){
        return this._bg;
    }

    set bgColor( rgb ){
        this._bg = rgb;
        this._bg[3] = 1.0;
    }

    get camera(){
        return this._camera;
    }

    get doubleBuffering(){
        return this._doubleBuffering;
    }

    set doubleBuffering(rt = false){
        if (rt){
            this._doubleBuffering = true;
            this.initBuffers();
        }else{
            this._doubleBuffering = false;
        }
    }

    // Scene graph methods
    clearScene(){
        this._scene = [];
    }

    addSceneNode(node){
        node.init(this.gl);
        this._scene.push(node);
    } 
    
    // Main render loop methods
    start(){
        if(!this._isRunning){
            this._isRunning = true;
            animationFrameInstance.animate(this);
        }
    }

    stop(){
        if(this._isRunning){
            this._isRunning = false;
            animationFrameInstance.release(this);
            this.clearCanvas();
        }
    }

    update(dt){
        // Call back for updates
        if(this._sceneController != undefined) {
            this._sceneController.update(dt); 
        }       

        // Renderer has been paused or stoped
        if(!this._isRunning){
            return;
        }       

        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.BLEND);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.enable(this.gl.DEPTH_TEST);


        // Render to buffer 
        if(this.doubleBuffering){
            this.bindBuffer();
        }
        
        // Render
        this.clearCanvas();
        this.renderScene();       
        
        // Render front buffer and swap them
        if(this.doubleBuffering){
            this.renderBuffer();
            this.swapBuffers();
        }
    }

    renderScene(){
        // Draw scene nodes
        for (var node of this._scene) {

            if(!node.shader.program){
                console.log("Invalid shader program");
                continue;
            }

            node.shader.useProgram();
            
            if(node.hasTexture){
                node.shader.bindTexture(node.texture.glTexture);
            }
            
            // Bind back buffer as texture
            if(this.doubleBuffering){
                node.shader.bindTexture(this.backBuffer.texture.glTexture, 1);
                node.shader.useRenderedTexture = false;
            }
        
            node.shader.vpMatrix = this._camera.viewProjectionMatrix;
            node.shader.modelMatrix = node.modelMatrix;
            node.shader.resolution = [this.width, this.height];

            node.draw(this.gl); 
        }
    }
    
    renderBuffer(){
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this._bufferQuad.shader.bindTexture(this.frontBuffer.texture.glTexture, 1);
        this._bufferQuad.resolution = [this.width, this.height];
        this._bufferQuad.draw(this.gl); 
    }

    // Canvas routines: clear, resize
    clearCanvas(){
        this.gl.clearColor(this._bg[0], this._bg[1], this._bg[2], this._bg[3]);
        this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
    }

    // TODO wait for user to stop resizing the canvas before computing everything
    resize(forcelayout = false) {
        if(this._canvas == null){
            return;
        }
        
        this._density = browser.retina ? 2 : 1;

        // Check if height did change beyond mobile safari toolbar scroll
        let newWidth = browser.vpw * this._density;
        let newHeight = browser.vph * this._density;

        this.width = newWidth;
        this.height = newHeight;
        this._canvas.width = this.width;
        this._canvas.height = this.height;
        this._canvas.style.width = browser.vpw+"px";
        this._canvas.style.height = browser.vph+"px";

        if(forcelayout){
            this.resizeViewport();
            return;
        }

        // Add delay, waiting for user to finish resizing the viewport
        if(this._delayedResizing != null ){
            clearTimeout(this._delayedResizing);
        }

        this._delayedResizing = setTimeout(() => {
            this._delayedResizing = null;
            this.resizeViewport();
        }, 100);
    }   

    resizeViewport(){
          // Update viewport dependent contexts
          this.initBuffers();
          this.gl.viewport( 0, 0, this.width, this.height);
          this._camera.setViewport(this.width, this.height);
          this._sceneController.surfaceDidChange(this.width, this.height, this._density);
    }
}