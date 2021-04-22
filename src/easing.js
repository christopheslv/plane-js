export class Easing {
    constructor(targetObject, property, srcVal, dstVal, duration, easing = "ease-in-out") {
        this._target = targetObject;
        this._property = property;

        this._srcVal = srcVal; 
        this._dstVal = dstVal;
        this._offset = this._dstVal - this._srcVal;

        this._duration = duration;
      
        this._lastTime = 0.0;
        this._isRunning = false;
        this._isDone = false;

        this.easing = easing;
    }

    stop() {
        if(!this._isRunning){
            return;
        }

        this._isRunning = false;
       // this._target[this._property] = this._srcVal;
        this._lastTime = 0.0; 
    }

    update(dt) {
        if(!this._isRunning){
            this._isRunning = true;
            this._isDone = false;
            this._lastTime = 0.0;
        }

        // Property is already in dst state, nothing to be done
        let delta = Math.abs(this._target[this._property] - this._dstVal);

        if( delta < 0.001 ){
            this._isDone = true;
            this._target[this._property] = this._dstVal;
            return;
        }

        this._lastTime += dt/1000;
        let curTime = this._lastTime;

        if(curTime > this._duration){
            curTime = this._duration;
        }
        let curIncrement = 0;
        
        if(this.easing == "ease-in"){
            curIncrement = this.CubicEaseIn(curTime, this._srcVal, this._offset, this._duration);
        }else if(this.easing == "ease-out"){
            curIncrement = this.CubicEaseOut(curTime, this._srcVal, this._offset, this._duration);
        }else if(this.easing == "quart-ease-out"){
            curIncrement = this.QuartEaseOut(curTime, this._srcVal, this._offset, this._duration);
        }else if(this.easing == "quart-ease-in-out"){
            curIncrement = this.QuartEaseInOut(curTime, this._srcVal, this._offset, this._duration);
        }else if(this.easing == "quint-ease-out"){
            curIncrement = this.QuintEaseOut(curTime, this._srcVal, this._offset, this._duration);
        }else if(this.easing == "ease-in-out") {
            curIncrement = this.CubicEaseInOut(curTime, this._srcVal, this._offset, this._duration);
        }else if(this.easing == "sine-ease-in-out") {
                curIncrement = this.SineEaseInOut(curTime, this._srcVal, this._offset, this._duration);
        }else{ // linear
            curIncrement = this.Linear(curTime, this._srcVal, this._offset, this._duration);
        }
        
        this._target[this._property] = curIncrement;
    }

    get isRunning(){
        return this._isRunning;
    }

    get isDone(){
        return this._isDone;
    }

    get duration(){
        return this._duration;
    }

    /* Easing functions */

    Linear(t,b,c,d){
        return c*t/d + b;
    }

    // Sine
    SineEaseIn(t,b,c,d){
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    }
    SineEaseOut(t,b,c,d){
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    }
    SineEaseInOut(t,b,c,d){
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    }

    // Cubic
    CubicEaseIn (t,b,c,d){
        t/=d;
        return c*t*t*t + b;
    }
    CubicEaseOut(t,b,c,d){
        t=t/d-1;
        return c*(t*t*t + 1) + b;
    }
    CubicEaseInOut(t,b,c,d){
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        t-=2;
        return c/2*(t*t*t + 2) + b;
    }

    // Quart
    QuartEaseIn (t,b,c,d) {
        return c*(t/=d)*t*t*t + b;
    }
    QuartEaseOut(t,b,c,d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    }
    QuartEaseInOut(t,b,c,d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    }

    // Quint
    QuintEaseIn (t,b,c,d) {
        return c*(t/=d)*t*t*t*t + b;
    }
    QuintEaseOut(t,b,c,d) {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    }
    QuintEaseInOut(t,b,c,d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    }
}
