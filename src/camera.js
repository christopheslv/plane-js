import * as mat from './mat4.js';

export class Camera {

    constructor() {
        this.vpHeight = 0;
        this.vpWidth = 0;

        this._projectionMatrix = mat.identity();
        this._viewMatrix = mat.identity();
        this._vpMatrix = mat.identity();
        this._pendingMatrixUpdates = true;

        this.isOrtho = true;
        this.near = -5000;
        this.far = 5000;
    }

    get viewProjectionMatrix(){
        this.update();
        return this._vpMatrix;
    }

    get hasPendingUpdates(){
        return this._pendingMatrixUpdates;
    }

    setViewport(width, height){
        this.vpWidth = width;
        this.vpHeight = height;
        this._pendingMatrixUpdates = true;
    }

    setPerspective(){
        let aspectRatio = this.vpWidth / this.vpHeight;
        this._projectionMatrix = mat.perspective(45.0 * Math.PI / 180.0, aspectRatio, 1.0, 100.0);
        this.isOrtho = false;
        this._pendingMatrixUpdates = true;
    }

    setOrtho(){
        this._projectionMatrix = mat.ortho(-this.vpWidth/2, this.vpWidth/2, -this.vpHeight/2, this.vpHeight/2, this.near, this.far);
        this.isOrtho = true;
        this._pendingMatrixUpdates = true;
    }

    lookAt( eye, target, up){
        this._viewMatrix = mat.lookAt( eye, target, up);
        this._pendingMatrixUpdates = true;
    }

    update(){
        if(this._pendingMatrixUpdates){

            if(this.isOrtho){
                this.setOrtho();
            }else{
                this.setPerspective();
            }

            this._vpMatrix = mat.multiply(this._projectionMatrix, this._viewMatrix);
            this._pendingMatrixUpdates = false;
        }
    }


}