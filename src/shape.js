import { SceneNode } from './scene.js';

export class Shape extends SceneNode{
    constructor() {
        super();

        this._triangleCount = 1;
        this._vbo_stride = 5;
        this.resetVertexData();
     }

    init(gl){
        super.init(gl);
        this._vbo = gl.createBuffer();
        this.resetVertexData();
        this.generateTriangles();
    }

    /* vbo/initializations */
    resetVertexData()
    {
        this._vdata = new Float32Array( this._triangleCount * 3 * this._vbo_stride );
        this._vbo_need_updates = true;
    }

    /* set/getters */

    set triangleCount(tc){
        this._triangleCount = tc;
        this.resetVertexData();
        this.generateTriangles();
    }

    get triangleCount(){
        return this._triangleCount;
    }

    /* Mesh Generation */
    
    // Fill in Vertex buffer (2 triangles per line)
    generateTriangles(){
        let i = 0;

        // bottom left
        this._vdata[i] = -0.86; // x
        this._vdata[i+1] = -0.5; // y
        this._vdata[i+2] = 0.0; // z
        this._vdata[i+3] = 0.0; // u
        this._vdata[i+4] = 0.0; // v
        i += this._vbo_stride;

        // bottom right
        this._vdata[i] = 0.86;
        this._vdata[i+1] = -0.5;
        this._vdata[i+2] = 0.0;
        this._vdata[i+3] = 1.0; // u
        this._vdata[i+4] = 0.0; // v
        i += this._vbo_stride;

        // top 
        this._vdata[i] =  0.0;
        this._vdata[i+1] = 1.0;
        this._vdata[i+2] = 0.0;
        this._vdata[i+3] = 0.5; // u
        this._vdata[i+4] = 1.0; // v
        i += this._vbo_stride;  

        this.updateVBO()
    }

    updateVBO(){
        this._vbo_need_updates = true;
    }

    draw(gl){
        super.draw(gl);

        if(this._vbo_need_updates){
            gl.bindBuffer( gl.ARRAY_BUFFER, this._vbo );
            gl.bufferData( gl.ARRAY_BUFFER, this._vdata, gl.STATIC_DRAW );
            this._vbo_need_updates = false;
        }

        // Render geometry
        var vbuff_position;

        gl.bindBuffer( gl.ARRAY_BUFFER, this._vbo );
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 20, 0 );
        gl.enableVertexAttribArray(0);

        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 20, 12);
        gl.enableVertexAttribArray(1);

        gl.drawArrays( gl.TRIANGLES, 0, this._triangleCount * 3 );
        gl.disableVertexAttribArray( vbuff_position );
    }

    // Basic math helpers
    v2add(v1,v2){
        return [ v1[0]+v2[0], v1[1]+v2[1]];
    }
}