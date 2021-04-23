# PlaneJS

![alt text](https://github.com/christopheslv/plane-js/blob/main/assets/torus.gif?raw=true)

### A Low-level Javascript 3D library ###

A very basic WebGL rendering library, based on JS ES6 modules, that I started from scratch for my [portfolio](https://cslv.me/).
I decided to share the code as-is, with some examples, in case this serves some projects somewhere.


### Roadmap ###

There is no specific plan or roadmap for now. However, this code-base might grow based on any specialized needs I might have in the future, probably around shaders, creative coding, and lo-fi analog renderings.


### Usage example ###

Here is a simple example of how the code can be used

```js
import { Renderer } from '../src/renderer.js';
import { SceneController } from '../src/scene.js';
import { Torus } from './js/torus.js';

class App extends SceneController{
    constructor() {   
        super();
    }

    run(canvasElement){
        // Elapsed time to 0
        this.t = 0;      

        // Let's create a custom shape
        this.shape = new Torus(0.5, 0.25, 24, 24);

        // Setup the renderer with the html canvas element, and use this app class as the scene controller
        this.renderer = new Renderer(canvasElement, this ); 

        // Camera is 3 units behind origin on z axis, looks at origin, and is in upright position
        this.renderer.camera.lookAt([0,0,3], [0,0,0], [0,1,0]);

        // Add default shape to renderer scene 
        this.renderer.addSceneNode(this.shape);

        // Starts rendering loop
        this.renderer.start();
    }

    // This is called on each animation frame
    update(dt){

        // Update scene and camera based on elapsed time
        this.t += dt;

        // Rotate shape on muyltiple axis
        this.shape.rotate(this.t/500, this.t/750, this.t/1000);
    }
}

const app = new App();
document.addEventListener('DOMContentLoaded', (e) => app.run(document.getElementById("renderer")) )
```

### Demos ###

The examples can be executed in WebGL compatible browser by using a local webserver, eg. with python:

```sh
# Move to project base directory
cd plane-js

# Start a local web server with python
python3 -m http.server
```

You can then navigate to [localhost:8000/demos](http://localhost:8000/demos/) to execute the examples.

### License ###

MIT, see [LICENSE.md](http://github.com/christopheslv/plane-js/blob/main/LICENSE.md) for details.