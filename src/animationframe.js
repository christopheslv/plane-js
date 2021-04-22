class AnimationFrame {
    constructor(fps=60) {
        this._counter = 0;
        this._fps = 60;
        this._dt = 0;
        this._lastTime = Date.now();
        this._animate = false;
        this._requestFrameId = undefined;

        this._subscribers = [];
    }

    // Main render loop methods
    start(){
        this._animate = true;

        if (!this._requestFrameId) {
            this._requestFrameId = window.requestAnimationFrame(() => this.frame());
            this._lastTime = Date.now();
        }
    }

    stop(){
        this._animate = false;

        if (this._requestFrameId) {
            window.cancelAnimationFrame(this._requestFrameId);
            this._requestFrameId = undefined;
            }
    }

    // Subscriber pattern
    animate(obj){
        if(!this._subscribers.includes(obj)){
            this._subscribers.push(obj);

            // start request animation frame if needed
            if(!this._animate){
                this.start();
            }
        }
    }

    release(obj){
        if(this._subscribers.includes(obj)){
            let i = 0;
            for (var node of this._subscribers) {
                if(node === obj){
                    break;
                }else{
                    i++;
                }
            }
            this._subscribers.splice(i,1);
        }
    }

    frame(){
        // Compute delta time
        var curtime = Date.now();
        var dt = curtime - this._lastTime;
        this._counter++;

        // Call back subscribers updates
        for (var node of this._subscribers) {
            node.update(dt); 
        }
        
        // If there is no more subscribers then stop requesting Animation Frames
        if(this._subscribers.length == 0){
            this.stop();
            return;
        }

        if(this._animate){
            this._requestFrameId = window.requestAnimationFrame(() => this.frame());
        }

        this._lastTime = curtime;
    }
}

const animationFrameInstance = new AnimationFrame();
export default animationFrameInstance;