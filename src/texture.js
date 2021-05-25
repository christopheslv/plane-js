export class Texture {
    constructor() {
        this._gl_texture = null;
        this.gl = null;
        this.url = null;
        this._isLoaded = false;

        this.width = 0;
        this.height = 0;
        this.internalFormat = null;
    }

    init(gl, width, height){
        this.width = width;
        this.height = height;
        this._gl_texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this._gl_texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
            this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    initFromURL(gl, url){
        this.gl = gl;
        this.url = url;
        this._isLoaded = false;
        this.loadFromImage(this.gl);
    }

    get glTexture(){
        return this._gl_texture;
    }

    get isLoaded(){
        return this._isLoaded;
    }

    loadFromImage(gl) {
        this._gl_texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this._gl_texture);
    
        // temp pixel image
        const pixel = new Uint8Array([255, 0, 0, 255]);  
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    
        // Load image
        const img = new Image();
        img.onload = () => {     
            gl.bindTexture(gl.TEXTURE_2D, this._gl_texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            this._isLoaded = true; 
        };

        img.src = this.url;
    }

    isPowerOf2(value) {
        return (value & (value - 1)) == 0;
    }
}
