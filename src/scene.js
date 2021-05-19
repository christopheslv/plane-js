import * as mat from './mat4.js';
import { Shader } from './shader.js';

export class SceneController {
    constructor() {}
    update(dt){}
    surfaceDidChange(width,height,density){}
}

export class SceneNode {
    constructor() {
        this.texture = null;
        
        this._opacity = 1.0;
        this._rotation = [0,0,0];
        this._position = [0,0,0];

        this.mtrans = mat.identity();
        this.mrot = mat.identity();
        this._mMatrix = mat.identity();
        this._pendingMatrixUpdates = false;

        this.shader = new Shader();
    }

    init(gl){
       this.shader.init(gl);
    }

    get position(){
        return this._position;
    }
    
    set position(np){
        this.translate(np[0], np[1], np[2]);
    }

    get opacity(){
        return this._opacity;
    }
    
    set opacity(newopacity = 1.0){
        this._opacity = newopacity;
    }

    get hasTexture(){
        return this.texture != null;
    }

    get modelMatrix(){
        this.updateMatrix();
        return this._mMatrix;
    }

    rotate(x,y,z){
        if(this._rotation[0] != x || this._rotation[1] != y || this._rotation[2] != z){
            this._rotation = [x,y,z];
            this.mrot = mat.eulerRotation([x,y,z]);
            this._pendingMatrixUpdates = true;
        }
    }

    translate(x,y,z){
        if(this._position[0] != x || this._position[1] != y || this._position[2] != z){
            this._position = [x,y,z];
            this.mtrans = mat.translation([x,y,z]);
            this._pendingMatrixUpdates = true;
        }
    }

    updateMatrix(){
        if(this._pendingMatrixUpdates){
            this._mMatrix = mat.multiply(this.mtrans, this.mrot);
            this._pendingMatrixUpdates = false;
        }
    }

    draw(gl){
        // any updates will be rendered on next render loop
    }
}

