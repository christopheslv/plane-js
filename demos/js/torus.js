// Credits: based on Three JS torus geometry
// https://github.com/mrdoob/three.js/blob/d49bb0e85f9c013198dc5a6c0f94f0bbe6a02add/src/extras/geometries/TorusGeometry.js

import { Shape } from '../../src/shape.js';

export class Torus extends Shape{
    constructor(radius, tube, radialSegments, tubularSegments) {
        super();

        this.radius = radius;
        this.tube = tube;
        this.radialSegments = radialSegments;
        this.tubularSegments = tubularSegments;
        this.arc = Math.PI * 2
    }

    generateTriangles(){
        this.vertices = [];

        let center = [], tempv = [], uvs = [], normals = [];

        // Generate vertices
        for ( var j = 0; j <= this.radialSegments; j ++ ) {
            for ( var i = 0; i <= this.tubularSegments; i ++ ) {
    
                var u = i / this.tubularSegments * this.arc;
                var v = j / this.radialSegments * Math.PI * 2;
    
                center[0] = this.radius * Math.cos( u );
                center[1] = this.radius * Math.sin( u );
    
                var vertex = [];
                vertex[0] = ( this.radius + this.tube * Math.cos( v ) ) * Math.cos( u );
                vertex[1] = ( this.radius + this.tube * Math.cos( v ) ) * Math.sin( u );
                vertex[2] = this.tube * Math.sin( v );
                vertex[3] = 0.25 + (i / this.tubularSegments) % 0.5;  // u
                vertex[4] = 0.25 + (j / this.radialSegments*2) % 0.5;  // v
    
                tempv.push( vertex );   
            }
        }
        
        let index = 0;
    
        // Generate faces
        for ( var j = 1; j <= this.radialSegments; j ++ ) {
            for ( var i = 1; i <= this.tubularSegments; i ++ ) {
    
                var a = ( this.tubularSegments + 1 ) * j + i - 1;
                var b = ( this.tubularSegments + 1 ) * ( j - 1 ) + i - 1;
                var c = ( this.tubularSegments + 1 ) * ( j - 1 ) + i;
                var d = ( this.tubularSegments + 1 ) * j + i;
    
                // First triangle
                this.vertices.push( tempv[a] ); 
                this.vertices.push( tempv[b] ); 
                this.vertices.push( tempv[d] ); 

                // Second triangle
                this.vertices.push( tempv[b] ); 
                this.vertices.push( tempv[c] ); 
                this.vertices.push( tempv[d] ); 
            }
        }
    
        this.updateVBO()
    }
}