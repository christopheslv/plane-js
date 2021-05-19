const vertex_shader_default = `
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

const fragment_shader_default = `
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

export class Shader{
    constructor() {
        this._program = null;
        this._matrixLocation = null;
        this._modelMatLocation = null;
        this._resolutionLocation = null;
        this._textureLocation = null;
        this._timeLocation = null;
    }

    init(gl){
        this.gl = gl;
        this._program = this.createProgram(gl, this.vertexShader , this.fragmentShader);

        this._matrixLocation = this.gl.getUniformLocation( this._program, 'vpMat' );
        this._modelMatLocation = this.gl.getUniformLocation( this._program, 'modelMat' );
        this._resolutionLocation = this.gl.getUniformLocation( this._program, 'resolution' );
        this._textureLocation = this.gl.getUniformLocation( this._program, 'texture' );
        this._timeLocation = this.gl.getUniformLocation( this._program, 'time' );
    }

    get vertexShader(){
        return vertex_shader_default;
    }

    get fragmentShader(){
        return fragment_shader_default;
    }

    get program(){
        return this._program;
    }

    useProgram(){
        this.gl.useProgram( this._program );
    }

    bindTexture(texture){
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.uniform1i(this._textureLocation, 0);
    }

    set vpMatrix(mat){
        this.gl.uniformMatrix4fv( this._matrixLocation, false, mat);
    }

    set modelMatrix(mat){
        this.gl.uniformMatrix4fv( this._modelMatLocation, false, mat);
    }

    set resolution(res){
        this.gl.uniform2f( this._resolutionLocation, res[0], res[1]);
    }

    set time(tt){
        this.gl.uniform1f( this._timeLocation, tt);
    }

    createProgram(gl, vertex, fragment) {
    
        var program = gl.createProgram(vertex, fragment);

        var vs = this.createShader( gl, vertex, gl.VERTEX_SHADER );
        var fs = this.createShader( gl, '#ifdef GL_ES\nprecision highp float;\n#endif\n\n' + fragment, gl.FRAGMENT_SHADER );

        if ( vs == null || fs == null ){
            console.log( "ERROR while creating shaders");
            return null;
        } 

        gl.attachShader( program, vs );
        gl.attachShader( program, fs );

        gl.deleteShader( vs );
        gl.deleteShader( fs );

        gl.bindAttribLocation(program, 0, 'position');
        gl.bindAttribLocation(program, 1, 'texcoord');

        gl.linkProgram( program );

        if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
            console.log( "ERROR:\n" +
            "VALIDATE_STATUS: " + gl.getProgramParameter( program, gl.VALIDATE_STATUS ) + "\n" +
            "ERROR: " + gl.getError() + "\n\n" +
            "- Vertex Shader -\n" + vertex + "\n\n" +
            "- Fragment Shader -\n" + fragment );

            return null;
        }

        return program;
    }

    createShader(gl,  src, type ) {
        var shader = gl.createShader( type );

        gl.shaderSource( shader, src );
        gl.compileShader( shader );

        if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {

            console.log( ( type == gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT" ) + " SHADER:\n" + gl.getShaderInfoLog( shader ) );
            return null;

        }
        return shader;
    }
}
