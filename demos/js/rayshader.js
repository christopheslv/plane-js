// Raytracing code inspired by https://raytracing.github.io/books/RayTracingInOneWeekend.html#surfacenormalsandmultipleobjects/frontfacesversusbackfaces

import { Shader } from '../../dist/plane.js';

var getSourceFromFile = function(url) {
    var req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send(null);
    return (req.status == 200) ? req.responseText : null;
  }; 
  
export class RayShader extends Shader{
    constructor() {
        super();
    }

    init(gl){
        super.init(gl);
        this._sampleStartLocation = this.gl.getUniformLocation( this.program, 'sampling_start' );
    }
    
    get fragmentShader(){
        return getSourceFromFile("./shaders/ray.frag");
    }

    set samplingStart(ss){
        this.gl.uniform1f(this._sampleStartLocation, ss);
    }
}