# plane.js

![Rotating torus](https://github.com/christopheslv/plane-js/blob/main/assets/torus.gif?raw=true)

### A Low-level 3D experimentation library in javascript ###

A very simple rendering library, based on JS ES6 modules, I did start from scratch for my [portfolio](https://cslv.me/).


### Roadmap ###

There is no specific plan or roadmap for now. However, this code-base might grow based on any specialized needs or experiments I might explore in the future, probably around shaders, creative coding, and lo-fi analog renderings.


### Usage example ###

An example of how the code can be used:

```js
import { Renderer } from '../src/renderer.js';
import { SceneController } from '../src/scene.js';
import { Torus } from './js/torus.js';

class App extends SceneController{
    constructor() {   
        super();
    }

    run(canvasElement){
        this.t = 0;      
        this.shape = new Torus(0.5, 0.25, 24, 24);
        this.renderer = new Renderer(canvasElement, this ); 
        this.renderer.camera.lookAt([0,0,3], [0,0,0], [0,1,0]);
        this.renderer.addSceneNode(this.shape);
        this.renderer.start();
    }

    update(dt){
        this.t += dt;
        this.shape.rotate(this.t/500, this.t/750, this.t/1000);
    }
}

const app = new App();
document.addEventListener('DOMContentLoaded', (e) => app.run(document.getElementById("renderer")) )
```

### Library ###

Bundled JS library files are available in the /dist folder, and can be generated through npm:

```sh
# Bundle 
npm run build

# Minified bundle
npm run build-min
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