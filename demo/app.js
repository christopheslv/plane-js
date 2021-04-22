import { Renderer } from '../src/renderer.js';
import { SceneController } from '../src/scene.js';

class App extends SceneController{
    constructor() {   
        super();
    }

    run(canvasElement){
        this.renderer = new Renderer(canvasElement, this ); 
        this.renderer.bgColor = [1.0, 0, 0];   
        this.renderer.start();
    }

    update(dt){
        // Update
    }

    surfaceDidChange(width,height,density){
        // Do any geometry updates based on new viewport
    }
}

const app = new App();
document.addEventListener('DOMContentLoaded', (e) => app.run(document.getElementById("renderer")) )