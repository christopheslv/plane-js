import * as mat from './mat4.js';

export class Camera {

    constructor() {
        this.vpHeight = 0;
        this.vpWidth = 0;

        this.aspectRatio = 16/9;

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
        this._projectionMatrix = mat.perspective(45.0 * Math.PI / 180.0, this.aspectRatio, 1.0, 100.0);
        this.isOrtho = false;
        this._pendingMatrixUpdates = true;
    }

    setOrtho(){
        this._projectionMatrix = mat.ortho(-this.aspectRatio, this.aspectRatio, -1.0, 1.0, this.near, this.far);
        this.isOrtho = true;
        this._pendingMatrixUpdates = true;
    }

    lookAt( eye, target, up){
        this._viewMatrix = mat.lookAt( eye, target, up);
        this._pendingMatrixUpdates = true;
    }

    update(){
        if(this._pendingMatrixUpdates){

            this.aspectRatio = this.vpWidth / this.vpHeight;

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