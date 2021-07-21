// src/vec3.js
function length(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}
function normalize(v) {
  let l = length(v);
  if (l == 0) {
    return v;
  }
  let scale = 1 / l;
  return new Float32Array([
    v[0] * scale,
    v[1] * scale,
    v[2] * scale
  ]);
}
function sub(v1, v2) {
  return new Float32Array([
    v1[0] - v2[0],
    v1[1] - v2[1],
    v1[2] - v2[2]
  ]);
}
function crossProduct(v1, v2) {
  return new Float32Array([
    v1[1] * v2[2] - v2[1] * v1[2],
    v1[2] * v2[0] - v2[2] * v1[0],
    v1[0] * v2[1] - v2[0] * v1[1]
  ]);
}
function dotProduct(v1, v2) {
  return v2[0] * v1[0] + v2[1] * v1[1] + v2[2] * v1[2];
}

// src/mat4.js
function identity() {
  return new Float32Array([
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  ]);
}
function perspective(fovyRadians, aspect, nearZ, farZ) {
  let cotan = 1 / Math.tan(fovyRadians / 2);
  return new Float32Array([
    cotan / aspect,
    0,
    0,
    0,
    0,
    cotan,
    0,
    0,
    0,
    0,
    (farZ + nearZ) / (nearZ - farZ),
    -1,
    0,
    0,
    2 * farZ * nearZ / (nearZ - farZ),
    0
  ]);
}
function ortho(left, right, bottom, top, nearZ, farZ) {
  let ral = right + left;
  let rsl = right - left;
  let tab = top + bottom;
  let tsb = top - bottom;
  let fan = farZ + nearZ;
  let fsn = farZ - nearZ;
  return new Float32Array([
    2 / rsl,
    0,
    0,
    -ral / rsl,
    0,
    2 / tsb,
    0,
    -tab / tsb,
    0,
    0,
    -2 / fsn,
    -fan / fsn,
    0,
    0,
    0,
    1
  ]);
}
function lookAt(eye, target, up) {
  let m = new Float32Array(16);
  let vUp = normalize(up);
  let zaxis = normalize(sub(eye, target));
  let xaxis = normalize(crossProduct(vUp, zaxis));
  let yaxis = normalize(crossProduct(zaxis, xaxis));
  m[0] = xaxis[0];
  m[1] = yaxis[0];
  m[2] = zaxis[0];
  m[3] = 0;
  m[4] = xaxis[1];
  m[5] = yaxis[1];
  m[6] = zaxis[1];
  m[7] = 0;
  m[8] = xaxis[2];
  m[9] = yaxis[2];
  m[10] = zaxis[2];
  m[11] = 0;
  m[12] = -dotProduct(xaxis, eye);
  m[13] = -dotProduct(yaxis, eye);
  m[14] = -dotProduct(zaxis, eye);
  m[15] = 1;
  return m;
}
function translation(tvec) {
  return new Float32Array([
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    tvec[0],
    tvec[1],
    tvec[2],
    1
  ]);
}
function eulerRotation(rvec) {
  let rX = identity();
  let rY = identity();
  let rZ = identity();
  rX[5] = Math.cos(rvec[0]);
  rX[6] = -Math.sin(rvec[0]);
  rX[9] = Math.sin(rvec[0]);
  rX[10] = Math.cos(rvec[0]);
  rY[0] = Math.cos(rvec[1]);
  rY[2] = Math.sin(rvec[1]);
  rY[8] = -Math.sin(rvec[1]);
  rY[10] = Math.cos(rvec[1]);
  rZ[0] = Math.cos(rvec[2]);
  rZ[1] = -Math.sin(rvec[2]);
  rZ[4] = Math.sin(rvec[2]);
  rZ[5] = Math.cos(rvec[2]);
  return multiply(rX, multiply(rY, rZ));
}
function multiply(mleft, mright) {
  let m = new Float32Array(16);
  m[0] = mleft[0] * mright[0] + mleft[4] * mright[1] + mleft[8] * mright[2] + mleft[12] * mright[3];
  m[4] = mleft[0] * mright[4] + mleft[4] * mright[5] + mleft[8] * mright[6] + mleft[12] * mright[7];
  m[8] = mleft[0] * mright[8] + mleft[4] * mright[9] + mleft[8] * mright[10] + mleft[12] * mright[11];
  m[12] = mleft[0] * mright[12] + mleft[4] * mright[13] + mleft[8] * mright[14] + mleft[12] * mright[15];
  m[1] = mleft[1] * mright[0] + mleft[5] * mright[1] + mleft[9] * mright[2] + mleft[13] * mright[3];
  m[5] = mleft[1] * mright[4] + mleft[5] * mright[5] + mleft[9] * mright[6] + mleft[13] * mright[7];
  m[9] = mleft[1] * mright[8] + mleft[5] * mright[9] + mleft[9] * mright[10] + mleft[13] * mright[11];
  m[13] = mleft[1] * mright[12] + mleft[5] * mright[13] + mleft[9] * mright[14] + mleft[13] * mright[15];
  m[2] = mleft[2] * mright[0] + mleft[6] * mright[1] + mleft[10] * mright[2] + mleft[14] * mright[3];
  m[6] = mleft[2] * mright[4] + mleft[6] * mright[5] + mleft[10] * mright[6] + mleft[14] * mright[7];
  m[10] = mleft[2] * mright[8] + mleft[6] * mright[9] + mleft[10] * mright[10] + mleft[14] * mright[11];
  m[14] = mleft[2] * mright[12] + mleft[6] * mright[13] + mleft[10] * mright[14] + mleft[14] * mright[15];
  m[3] = mleft[3] * mright[0] + mleft[7] * mright[1] + mleft[11] * mright[2] + mleft[15] * mright[3];
  m[7] = mleft[3] * mright[4] + mleft[7] * mright[5] + mleft[11] * mright[6] + mleft[15] * mright[7];
  m[11] = mleft[3] * mright[8] + mleft[7] * mright[9] + mleft[11] * mright[10] + mleft[15] * mright[11];
  m[15] = mleft[3] * mright[12] + mleft[7] * mright[13] + mleft[11] * mright[14] + mleft[15] * mright[15];
  return m;
}

// src/animationframe.js
var AnimationFrame = class {
  constructor(fps = 60) {
    this._counter = 0;
    this._fps = 60;
    this._dt = 0;
    this._lastTime = Date.now();
    this._animate = false;
    this._requestFrameId = void 0;
    this._subscribers = [];
  }
  start() {
    this._animate = true;
    if (!this._requestFrameId) {
      this._requestFrameId = window.requestAnimationFrame(() => this.frame());
      this._lastTime = Date.now();
    }
  }
  stop() {
    this._animate = false;
    if (this._requestFrameId) {
      window.cancelAnimationFrame(this._requestFrameId);
      this._requestFrameId = void 0;
    }
  }
  animate(obj) {
    if (!this._subscribers.includes(obj)) {
      this._subscribers.push(obj);
      if (!this._animate) {
        this.start();
      }
    }
  }
  release(obj) {
    if (this._subscribers.includes(obj)) {
      let i = 0;
      for (var node of this._subscribers) {
        if (node === obj) {
          break;
        } else {
          i++;
        }
      }
      this._subscribers.splice(i, 1);
    }
  }
  frame() {
    var curtime = Date.now();
    var dt = curtime - this._lastTime;
    this._counter++;
    for (var node of this._subscribers) {
      node.update(dt);
    }
    if (this._subscribers.length == 0) {
      this.stop();
      return;
    }
    if (this._animate) {
      this._requestFrameId = window.requestAnimationFrame(() => this.frame());
    }
    this._lastTime = curtime;
  }
};
var animationFrameInstance = new AnimationFrame();
var animationframe_default = animationFrameInstance;

// src/browser.js
var Browser = class {
  constructor() {
    this.update();
    window.addEventListener("resize", () => this.update(), false);
  }
  get safari() {
    return this._isSafari;
  }
  get mobile() {
    return this._isMobile;
  }
  get touchdevice() {
    return this._istouch;
  }
  get vpw() {
    return this._vpw;
  }
  get vph() {
    return this._vph;
  }
  get retina() {
    return this._isRetina;
  }
  update() {
    this._isSafari = false;
    this._isChrome = false;
    this._isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    this._istouch = "ontouchstart" in document.documentElement;
    this._vpw = window.innerWidth;
    this._vph = window.innerHeight;
    this._isRetina = window.devicePixelRatio > 1;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("safari") != -1) {
      if (ua.indexOf("chrome") > -1) {
        this._isChrome = true;
      } else {
        this._isSafari = true;
      }
    }
  }
};
var browser = new Browser();
var browser_default = browser;

// src/camera.js
var Camera = class {
  constructor() {
    this.vpHeight = 0;
    this.vpWidth = 0;
    this.aspectRatio = 16 / 9;
    this._projectionMatrix = identity();
    this._viewMatrix = identity();
    this._vpMatrix = identity();
    this._pendingMatrixUpdates = true;
    this.isOrtho = true;
    this.near = -5e3;
    this.far = 5e3;
  }
  get viewProjectionMatrix() {
    this.update();
    return this._vpMatrix;
  }
  get hasPendingUpdates() {
    return this._pendingMatrixUpdates;
  }
  setViewport(width, height) {
    this.vpWidth = width;
    this.vpHeight = height;
    this._pendingMatrixUpdates = true;
  }
  setPerspective() {
    this._projectionMatrix = perspective(45 * Math.PI / 180, this.aspectRatio, 1, 100);
    this.isOrtho = false;
    this._pendingMatrixUpdates = true;
  }
  setOrtho() {
    this._projectionMatrix = ortho(-this.aspectRatio, this.aspectRatio, -1, 1, this.near, this.far);
    this.isOrtho = true;
    this._pendingMatrixUpdates = true;
  }
  lookAt(eye, target, up) {
    this._viewMatrix = lookAt(eye, target, up);
    this._pendingMatrixUpdates = true;
  }
  update() {
    if (this._pendingMatrixUpdates) {
      this.aspectRatio = this.vpWidth / this.vpHeight;
      if (this.isOrtho) {
        this.setOrtho();
      } else {
        this.setPerspective();
      }
      this._vpMatrix = multiply(this._projectionMatrix, this._viewMatrix);
      this._pendingMatrixUpdates = false;
    }
  }
};

// src/texture.js
var Texture = class {
  constructor() {
    this._gl_texture = null;
    this.gl = null;
    this.url = null;
    this._isLoaded = false;
    this.width = 0;
    this.height = 0;
    this.internalFormat = null;
  }
  init(gl, width, height) {
    this.width = width;
    this.height = height;
    this._gl_texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this._gl_texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
  initFromURL(gl, url) {
    this.gl = gl;
    this.url = url;
    this._isLoaded = false;
    this.loadFromImage(this.gl);
  }
  get glTexture() {
    return this._gl_texture;
  }
  get isLoaded() {
    return this._isLoaded;
  }
  loadFromImage(gl) {
    this._gl_texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this._gl_texture);
    const pixel = new Uint8Array([255, 0, 0, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
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
    return (value & value - 1) == 0;
  }
};

// src/shader.js
var vertex_shader_default = `
    attribute vec3 position; 
    attribute vec2 texcoord; 

    uniform mat4 vpMat;
    uniform mat4 modelMat;
    varying vec2 vUV;

    void main() 
    { 
        mat4 mvpMatrix = vpMat * modelMat;
        gl_Position = mvpMatrix * vec4( position, 1.0 ); 
        vUV = texcoord;
    }
`;
var fragment_shader_default = `
    uniform vec2 resolution; 
    uniform sampler2D texture;
    uniform float time;
    
    varying vec2 vUV;

    void main( void )
    {         
        // Final color
        gl_FragColor = vec4(vUV.x-vUV.y/2.0, 0.0, vUV.y, 1.0);

        // Premultiply canvas output
        gl_FragColor.rgb *= gl_FragColor.a;
    }
`;
var Shader = class {
  constructor() {
    this.program = null;
    this._matrixLocation = null;
    this._modelMatLocation = null;
    this._resolutionLocation = null;
    this._textureLocation = null;
    this._timeLocation = null;
  }
  init(gl) {
    this.gl = gl;
    this.program = this.createProgram(gl, this.vertexShader, this.fragmentShader);
    this._matrixLocation = this.gl.getUniformLocation(this.program, "vpMat");
    this._modelMatLocation = this.gl.getUniformLocation(this.program, "modelMat");
    this._resolutionLocation = this.gl.getUniformLocation(this.program, "resolution");
    this._timeLocation = this.gl.getUniformLocation(this.program, "time");
  }
  get vertexShader() {
    return vertex_shader_default;
  }
  get fragmentShader() {
    return fragment_shader_default;
  }
  useProgram() {
    this.gl.useProgram(this.program);
  }
  bindTexture(texture, texNum = 0) {
    this.gl.activeTexture(texNum == 0 ? this.gl.TEXTURE0 : this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.uniform1i(this.gl.getUniformLocation(this.program, "texture"), texNum);
  }
  set vpMatrix(mat4) {
    this.gl.uniformMatrix4fv(this._matrixLocation, false, mat4);
  }
  set modelMatrix(mat4) {
    this.gl.uniformMatrix4fv(this._modelMatLocation, false, mat4);
  }
  set resolution(res) {
    this.gl.uniform2f(this._resolutionLocation, res[0], res[1]);
  }
  set time(tt) {
    this.gl.uniform1f(this._timeLocation, tt);
  }
  createProgram(gl, vertex, fragment) {
    var program = gl.createProgram(vertex, fragment);
    var vs = this.createShader(gl, vertex, gl.VERTEX_SHADER);
    var fs = this.createShader(gl, "#ifdef GL_ES\nprecision highp float;\n#endif\n\n" + fragment, gl.FRAGMENT_SHADER);
    if (vs == null || fs == null) {
      console.log("ERROR while creating shaders");
      return null;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.bindAttribLocation(program, 0, "position");
    gl.bindAttribLocation(program, 1, "texcoord");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log("ERROR:\nVALIDATE_STATUS: " + gl.getProgramParameter(program, gl.VALIDATE_STATUS) + "\nERROR: " + gl.getError() + "\n\n- Vertex Shader -\n" + vertex + "\n\n- Fragment Shader -\n" + fragment);
      return null;
    }
    return program;
  }
  createShader(gl, src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log((type == gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT") + " SHADER:\n" + gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }
};

// src/scene.js
var SceneController = class {
  constructor() {
  }
  update(dt) {
  }
  surfaceDidChange(width, height, density) {
  }
};
var SceneNode = class {
  constructor() {
    this.texture = null;
    this._opacity = 1;
    this._rotation = [0, 0, 0];
    this._position = [0, 0, 0];
    this.mtrans = identity();
    this.mrot = identity();
    this._mMatrix = identity();
    this._pendingMatrixUpdates = false;
    this.shader = new Shader();
  }
  init(gl) {
    this.shader.init(gl);
  }
  get position() {
    return this._position;
  }
  set position(np) {
    this.translate(np[0], np[1], np[2]);
  }
  get opacity() {
    return this._opacity;
  }
  set opacity(newopacity = 1) {
    this._opacity = newopacity;
  }
  get hasTexture() {
    return this.texture != null;
  }
  get modelMatrix() {
    this.updateMatrix();
    return this._mMatrix;
  }
  rotate(x, y, z) {
    if (this._rotation[0] != x || this._rotation[1] != y || this._rotation[2] != z) {
      this._rotation = [x, y, z];
      this.mrot = eulerRotation([x, y, z]);
      this._pendingMatrixUpdates = true;
    }
  }
  translate(x, y, z) {
    if (this._position[0] != x || this._position[1] != y || this._position[2] != z) {
      this._position = [x, y, z];
      this.mtrans = translation([x, y, z]);
      this._pendingMatrixUpdates = true;
    }
  }
  updateMatrix() {
    if (this._pendingMatrixUpdates) {
      this._mMatrix = multiply(this.mtrans, this.mrot);
      this._pendingMatrixUpdates = false;
    }
  }
  draw(gl) {
  }
};

// src/shape.js
var Shape = class extends SceneNode {
  constructor() {
    super();
    this.width = 2;
    this.height = 2;
    this.vertices = [];
    this._vbo_stride = 5;
  }
  init(gl) {
    super.init(gl);
    this._vbo = gl.createBuffer();
    this.generateTriangles();
  }
  get triangleCount() {
    return this.vertices.length / 3;
  }
  generateTriangles() {
    this.vertices = [];
    let rx = this.width / 2;
    let ry = this.height / 2;
    this.vertices.push([-rx, -ry, 0, 0, 0]);
    this.vertices.push([rx, -ry, 0, 1, 0]);
    this.vertices.push([rx, ry, 0, 1, 1]);
    this.vertices.push([-rx, ry, 0, 0, 1]);
    this.vertices.push([-rx, -ry, 0, 0, 0]);
    this.vertices.push([rx, ry, 0, 1, 1]);
    this.updateVBO();
  }
  updateGeometry() {
    this.generateTriangles();
  }
  updateVBO() {
    this._vbo_need_updates = true;
  }
  generateVBO(gl) {
    if (this._vbo_need_updates) {
      this._vdata = new Float32Array(this.vertices.length * this._vbo_stride);
      let i = 0;
      for (var vert of this.vertices) {
        this._vdata[i] = vert[0];
        this._vdata[i + 1] = vert[1];
        this._vdata[i + 2] = vert[2];
        this._vdata[i + 3] = vert[3];
        this._vdata[i + 4] = vert[4];
        i += this._vbo_stride;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
      gl.bufferData(gl.ARRAY_BUFFER, this._vdata, gl.STATIC_DRAW);
      this._vbo_need_updates = false;
    }
  }
  draw(gl) {
    super.draw(gl);
    this.generateVBO(gl);
    var vbuff_position;
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 20, 12);
    gl.enableVertexAttribArray(1);
    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length);
    gl.disableVertexAttribArray(vbuff_position);
  }
};

// src/renderer.js
var Framebuffer = class {
  constructor(gl, width, height) {
    this.gl = gl;
    this.texture = new Texture();
    this.texture.init(this.gl, width, height);
    this.glBuffer = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.glBuffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture.glTexture, 0);
  }
};
var BufferShader = class extends Shader {
  constructor() {
    super();
  }
  get fragmentShader() {
    return `
            uniform vec2 resolution; 
            uniform sampler2D texture;

            void main( void ){         
                gl_FragColor = texture2D(texture, vec2(gl_FragCoord.x/ resolution.x, gl_FragCoord.y/ resolution.y));
            }
        `;
  }
};
var Renderer = class {
  constructor(canvas = null, sceneController) {
    this._canvas = canvas;
    this.gl = null;
    this.width = 0;
    this.height = 0;
    this._density = 1;
    this._sceneController = sceneController;
    this._scene = [];
    this._camera = null;
    this._mvpMatrix = identity;
    this._isRunning = false;
    this._delayedResizing = null;
    this._bg = [0, 0, 0, 0];
    this.init();
    this._doubleBuffering = false;
    this._isRenderingToBuffer = false;
    this._buffers = [];
    this._bIndex = 0;
    this._bufferQuad = null;
  }
  init() {
    try {
      this.gl = this._canvas.getContext("webgl");
    } catch (error) {
      console.log("Cannot create webGL context");
      return;
    }
    this._camera = new Camera();
    this._camera.setPerspective();
    this._camera.lookAt([0, 0, 3], [0, 0, 0], [0, 1, 0]);
    window.addEventListener("resize", () => this.resize(), false);
    this.resize();
  }
  initBuffers() {
    if (this.doubleBuffering) {
      this._buffers[0] = new Framebuffer(this.gl, this.width, this.height);
      this._buffers[1] = new Framebuffer(this.gl, this.width, this.height);
      this._fbIndex = 0;
      if (this._bufferQuad == null) {
        this._bufferQuad = new Shape();
        this._bufferQuad.shader = new BufferShader();
        this._bufferQuad.init(this.gl);
      }
    }
  }
  bindBuffer() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frontBuffer.glBuffer);
  }
  swapBuffers() {
    this._bIndex = 1 - this._bIndex;
  }
  get frontBuffer() {
    return this._buffers[this._bIndex];
  }
  get backBuffer() {
    return this._buffers[1 - this._bIndex];
  }
  get density() {
    return this._density;
  }
  get canvas() {
    return this._canvas;
  }
  get context() {
    return this.gl;
  }
  get bgColor() {
    return this._bg;
  }
  set bgColor(rgb) {
    this._bg = rgb;
    this._bg[3] = 1;
  }
  get camera() {
    return this._camera;
  }
  get doubleBuffering() {
    return this._doubleBuffering;
  }
  set doubleBuffering(rt = false) {
    if (rt) {
      this._doubleBuffering = true;
      this.initBuffers();
    } else {
      this._doubleBuffering = false;
    }
  }
  clearScene() {
    this._scene = [];
  }
  addSceneNode(node) {
    node.init(this.gl);
    this._scene.push(node);
  }
  start() {
    if (!this._isRunning) {
      this._isRunning = true;
      animationframe_default.animate(this);
    }
  }
  stop() {
    if (this._isRunning) {
      this._isRunning = false;
      animationframe_default.release(this);
      this.clearCanvas();
    }
  }
  update(dt) {
    if (this._sceneController != void 0) {
      this._sceneController.update(dt);
    }
    if (!this._isRunning) {
      return;
    }
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.BLEND);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
    this.gl.enable(this.gl.DEPTH_TEST);
    if (this.doubleBuffering) {
      this.bindBuffer();
    }
    this.clearCanvas();
    this.renderScene();
    if (this.doubleBuffering) {
      this.renderBuffer();
      this.swapBuffers();
    }
  }
  renderScene() {
    for (var node of this._scene) {
      if (!node.shader.program) {
        console.log("Invalid shader program");
        continue;
      }
      node.shader.useProgram();
      if (node.hasTexture) {
        node.shader.bindTexture(node.texture.glTexture);
      }
      if (this.doubleBuffering) {
        node.shader.bindTexture(this.backBuffer.texture.glTexture, 1);
        node.shader.useRenderedTexture = false;
      }
      node.shader.vpMatrix = this._camera.viewProjectionMatrix;
      node.shader.modelMatrix = node.modelMatrix;
      node.shader.resolution = [this.width, this.height];
      node.draw(this.gl);
    }
  }
  renderBuffer() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this._bufferQuad.shader.bindTexture(this.frontBuffer.texture.glTexture, 1);
    this._bufferQuad.resolution = [this.width, this.height];
    this._bufferQuad.draw(this.gl);
  }
  clearCanvas() {
    this.gl.clearColor(this._bg[0], this._bg[1], this._bg[2], this._bg[3]);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
  resize(forcelayout = false) {
    if (this._canvas == null) {
      return;
    }
    this._density = browser_default.retina ? 2 : 1;
    let newWidth = browser_default.vpw * this._density;
    let newHeight = browser_default.vph * this._density;
    this.width = newWidth;
    this.height = newHeight;
    this._canvas.width = this.width;
    this._canvas.height = this.height;
    this._canvas.style.width = browser_default.vpw + "px";
    this._canvas.style.height = browser_default.vph + "px";
    if (forcelayout) {
      this.resizeViewport();
      return;
    }
    if (this._delayedResizing != null) {
      clearTimeout(this._delayedResizing);
    }
    this._delayedResizing = setTimeout(() => {
      this._delayedResizing = null;
      this.resizeViewport();
    }, 100);
  }
  resizeViewport() {
    this.initBuffers();
    this.gl.viewport(0, 0, this.width, this.height);
    this._camera.setViewport(this.width, this.height);
    this._sceneController.surfaceDidChange(this.width, this.height, this._density);
  }
};

// src/index.js
var _SceneController = new SceneController();
var _Renderer = new Renderer();
