// Raytracing code inspired by https://raytracing.github.io/books/RayTracingInOneWeekend.html#surfacenormalsandmultipleobjects/frontfacesversusbackfaces

import { Shader } from '../../src/shader.js';

const fragment_shader_ray = `
    uniform vec2 resolution; 
    uniform sampler2D texture;
    uniform float time;

    const float far = 1000.0;
    const int max_depth = 50;
    const vec3 black = vec3(0.0, 0.0, 0.0); 
    const vec3 sky1 = vec3( 1.0, 1.0, 1.0);
    const vec3 sky2 = vec3( 0.25, 0.25, 0.25);
    
    float length_squared(vec3 v){
        return v.x * v.x + v.y * v.y + v.z * v.z;
    }

    float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    struct ray {
        vec3 origin;
        vec3 direction;
    };

    struct sphere {
        vec3 center;
        float radius;
    };

    vec3 ray_at(ray r, float t){
        return r.origin + t*r.direction;
    }

    struct rayHit {
        vec3 p;
        vec3 normal;
        float t;
        bool front_face;
    };
    
    vec3 rand_in_unit_sphere() {
        float lp = 1.0;
        vec3 p;

        vec2 uv = gl_FragCoord.xy / resolution * 10.0;
        vec2 seed = vec2(time/10000.0, time/10000.0);

        for(int i=0;i<10;++i)
        {
            float px = 2.0 * rand(uv+seed) - 1.0;
            seed += vec2(0.0001, 0.0002);
            float py = 2.0 * rand(uv+seed) - 1.0;
            seed += vec2(0.0001, 0.0002);
            float pz = 2.0 * rand(uv+seed) - 1.0;
            seed += vec2(0.0001, 0.0002);

            p = vec3(px, py, pz);
            lp = length(p); 
            if (lp < 1.0)
                return p;
        }

        return p;
    }

    vec3 rand_in_hemisphere(vec3 normal) {
        vec3 in_sphere = rand_in_unit_sphere();
        if (dot(in_sphere, normal) > 0.0)
            return in_sphere;
        else
            return -in_sphere;
    }

    bool sphere_hit(sphere s, ray r, float t_min, float t_max, out rayHit rec){
        vec3 oc = r.origin - s.center;
        float a = length_squared(r.direction);
        float half_b = dot(oc, r.direction);
        float c = length_squared(oc) - s.radius*s.radius;
        float discriminant = half_b*half_b - a*c;
        if (discriminant < 0.0) 
            return false;
        
        float sqrtd = sqrt(discriminant);
        
        float root = (-half_b - sqrtd) / a;
        if (root < t_min || t_max < root) {
            root = (-half_b + sqrtd) / a;
            if (root < t_min || t_max < root) 
                return false;
        }
        
        rec.t = root;
        rec.p = ray_at(r, rec.t);
        vec3 outn = (rec.p - s.center) / s.radius;
        rec.front_face = dot(r.direction, outn) < 0.0;
        rec.normal = rec.front_face ? outn : -outn;

        return true;
    }

    // Fake world description instead of array
    sphere scene_object(int objIndex){
        if (objIndex == 0) // ground
            return sphere(vec3(0.0, -100.5, -1.0), 100.0);
        else if (objIndex == 1) // left
            return sphere(vec3(-0.5, 0.0, -1.0), 0.5);
        else if (objIndex == 2) // right
            return sphere(vec3(0.5, 0.0, -1.0), 0.5);
        else if (objIndex == 3) // far
            return sphere(vec3(0.0, 0.0, -1.86), 0.5);
        else if (objIndex == 4) // top
            return sphere(vec3(0.0, 0.86, -1.35), 0.5);
    }

    bool world_hit(ray r, float t_min, float t_max, out rayHit rec){
       
        const int sphereCount = 5;

        rayHit tRec;
        bool hit_anything = false;
        float closest = t_max;

        // Loop through scene objects to find closest hit
       
        for(int i=0;i<sphereCount;i++){
            sphere s = scene_object(i);
            if( sphere_hit(s, r, t_min, closest, tRec)){
                hit_anything = true;
                closest = tRec.t;
                rec = tRec;
            }
        }

        return hit_anything;
    }

    vec3 bg_color(ray r){
        vec3 unit_direction = normalize(r.direction);
        float t = 0.5 * (unit_direction.y + 1.0);
        return (1.0-t)*sky1 + t*sky2;
    }

    vec3 hit_color(ray r){
        
        // start with light
        vec3 color_final = bg_color(r);
        ray temp_ray = r;
            
        // Bounce rays until nothing to bounce on
        int hitdepth = 0;
        for(int d=max_depth;d>0;--d)
        {
            rayHit rec;

            if( world_hit(temp_ray, 0.001, far, rec) ){
                hitdepth++;
                vec3 target = rec.p + rec.normal + rand_in_hemisphere(rec.normal);
                temp_ray = ray(rec.p, target - rec.p);
            }else{
                color_final = bg_color(temp_ray);
                break;
            }           
        }

        // Divise color by half for each bounce
        color_final = color_final * pow(0.5, float(hitdepth));

        // Gamma correct
        vec3 color = vec3( sqrt(color_final.x), sqrt(color_final.y), sqrt(color_final.z));
         return color;
    }

    void main( void ){         

        // Camera 
        float focal_length = 1.0;
        float aspect_ratio = resolution.x / resolution.y;
        float vp_height = 2.0;
        float vp_width = vp_height * aspect_ratio;

        // Move along z axis
        float cz = 1.0 + sin(time/500.0);

        vec3 origin = vec3( 0.0, 0.0, cz);
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