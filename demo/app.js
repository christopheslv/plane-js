import { Renderer } from '../src/renderer.js';
import { SceneController } from '../src/scene.js';
import { Shape } from '../src/shape.js';

class App extends SceneController{
    constructor() {   
        super();
    }

    run(canvasElement){
        this.t = 0;      

        this.shape = new Shape();
        this.shape.triangleCount = 1;

        this.renderer = new Renderer(canvasElement, this ); 
        this.renderer.camera.lookAt([0,0,5], [0,0,0], [0,1,0]);
        this.renderer.addSceneNode(this.shape);
        this.renderer.start();
    }

    update(dt){
        // Update
        this.t += dt;
        this.renderer.camera.lookAt([0,0, 10.0- (this.t/1000)%8], [0,0,0], [0,1,0]);
        this.shape.rotate(0,0,this.t/1000.);
    }

    surfaceDidChange(width,height,density){
        // Do any geometry updates based on viewport size
    }
}

const app = new App();
document.addEventListener('DOMContentLoaded', (e) => app.run(document.getElementById("renderer")) )