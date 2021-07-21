export class Triangle extends Shape{

    constructor() {
        super();
    }

    generateTriangles(){
        this.vertices = [];

        // default CCW front triangle: x, y, z, u, v
        this.vertices.push( [-0.86, -0.5, 0.0, 0.0, 0.0] ); // bottom left
        this.vertices.push( [0.86, -0.5, 0.0, 1.0, 0.0] );  // bottom right
        this.vertices.push( [0.0, 1.0, 0.0, 0.5, 1.0] );    // top 
        
        this.updateVBO()
    }

}