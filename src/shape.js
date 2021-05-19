import { SceneNode } from './scene.js';

export class Shape extends SceneNode{
    constructor() {
        super();

        this.width = 2.0;
        this.height = 2.0;

        this.vertices = [];
        this._vbo_stride = 5;
     }

    init(gl){
        super.init(gl);
        this._vbo = gl.createBuffer();
        this.generateTriangles();
    }

    /* set/getters */
    get triangleCount(){
        return this.vertices.length / 3;
    }

    /* Mesh Generation */
    
    // Default shape is a 2.0 unit quad centered on origin
    // Fill in Vertex buffer (2 triangles per line)
    generateTriangles(){
        this.vertices = [];

        let rx = this.width / 2.0;
        let ry = this.height / 2.0;

        // default CCW front triangle: x, y, z, u, v
        this.vertices.push( [-rx,-ry, 0.0, 0.0, 0.0] );   // bottom left
        this.vertices.push( [ rx,-ry, 0.0, 1.0, 0.0] );   // bottom right
        this.vertices.push( [ rx, ry, 0.0, 1.0, 1.0] );   // top right

        this.vertices.push( [-rx, ry, 0.0, 0.0, 1.0] );   // top left
        this.vertices.push( [-rx,-ry, 0.0, 0.0, 0.0] );   // bottom left
        this.vertices.push( [ rx, ry, 0.0, 1.0, 1.0] );   // top right
        
        this.updateVBO()
    }

    updateGeometry(){
        this.generateTriangles();
    }

    updateVBO(){
        this._vbo_need_updates = true;
    }

    generateVBO(gl){
        if(this._vbo_need_updates){
            this._vdata = new Float32Array( this.vertices.length * this._vbo_stride );
            let i = 0;

            for (var vert of this.vertices) {  
                this._vdata[i] = vert[0];   // x
                this._vdata[i+1] = vert[1]; // y
                this._vdata[i+2] = vert[2]; // z
                this._vdata[i+3] = vert[3]; // u
                this._vdata[i+4] = vert[4]; // v
                i += this._vbo_stride;
            }

            gl.bindBuffer( gl.ARRAY_BUFFER, this._vbo );
            gl.bufferData( gl.ARRAY_BUFFER, this._vdata, gl.STATIC_DRAW );
            this._vbo_need_updates = false;
        }
    }
   
    draw(gl){
        super.draw(gl);

        // Fill FBO if needed
        this.generateVBO(gl);

        // Render geometry
        var vbuff_position;

        gl.bindBuffer( gl.ARRAY_BUFFER, this._vbo );
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 20, 0 );
        gl.enableVertexAttribArray(0);

        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 20, 12);
        gl.enableVertexAttribArray(1);

        gl.drawArrays( gl.TRIANGLES, 0, this.vertices.length );
        gl.disableVertexAttribArray( vbuff_position );
    }
}