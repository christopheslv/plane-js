import { Shader } from '../../src/shader.js';

const fragment_shader_ray = `
    uniform vec2 resolution; 
    uniform sampler2D texture;
    uniform float time;
    
    struct ray {
        vec3 origin;
        vec3 direction;
    };

    vec3 ray_at(ray r, float t){
        return r.origin + t*r.direction;
    }

    float hit_sphere(vec3 center, float radius, ray r){
        vec3 oc = r.origin - center;
        float a = dot(r.direction * r.direction, vec3(1.0)); // length squared
        float half_b = dot(oc, r.direction);
        float c = dot(oc * oc, vec3(1.0)) - radius*radius; // length squared
        float discriminant = half_b*half_b - a*c;
        if (discriminant < 0.0) {
            return -1.0;
        } else {
            return (-half_b - sqrt(discriminant)) / a;
        }
    }

    vec3 hit_color(ray r){
        float radius = 0.25 + sin(time/500.0)/10.0;
        float t = hit_sphere( vec3(0.0, 0.0, -1.0), radius, r);
        if (t > 0.0) {
            vec3 nrm = normalize(ray_at(r, t) - vec3( 0.0, 0.0, -1.0));
            return 0.5*vec3( nrm.x+1.0, nrm.y+1.0, nrm.z+1.0);
        }

        vec3 unit_direction = normalize(r.direction);
        t = 0.5 * (unit_direction.y + 1.0);
        return (1.0-t)*vec3( 1.0,1.0,1.0) + t*vec3( 0.5, 0.7, 1.0);
    }

    void main( void ){         

        // Camera 
        float focal_length = 1.0;
        float aspect_ratio = resolution.x / resolution.y;
        float vp_height = 2.0;
        float vp_width = vp_height * aspect_ratio;

        vec3 origin = vec3( 0.0, 0.0, 0.0);
        vec3 horizontal = vec3( vp_width, 0.0, 0.0);
        vec3 vertical = vec3( 0.0, vp_height, 0.0);
        vec3 ll_corner = origin - horizontal/2.0 - vertical/2.0 - vec3( 0.0, 0.0, focal_length);

        // Ray
        float u = gl_FragCoord.x / resolution.x;
        float v = gl_FragCoord.y / resolution.y; 
        vec3 direction = ll_corner + u*horizontal + v*vertical - origin;
        ray r = ray(origin, direction);

        // Final color 
        gl_FragColor = vec4(hit_color(r).xyz, 1.0);

        // Premultiply canvas output
        gl_FragColor.rgb *= gl_FragColor.a;
    }
`;

export class RayShader extends Shader{
    constructor() {
        super();
        
    }
    
    get fragmentShader(){
        return fragment_shader_ray;
    }
}