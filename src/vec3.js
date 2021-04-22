export function length(v)
{
    return Math.sqrt((v[0] * v[0]) + (v[1] * v[1]) + (v[2] * v[2]));
}

export function normalize(v){
    let l = length(v);
    if( l == 0 ){
        return v;
    }
    
    let scale = 1.0 / l;

    return new Float32Array([
        v[0]*scale, 
        v[1]*scale, 
        v[2]*scale
    ]);
}

export function sub(v1, v2){
    return new Float32Array([
        v1[0]-v2[0], 
        v1[1]-v2[1], 
        v1[2]-v2[2]
    ]);
}

export function crossProduct(v1, v2){
    return new Float32Array([
        (v1[1] * v2[2]) - (v2[1] * v1[2]), 
        (v1[2] * v2[0]) - (v2[2] * v1[0]), 
        (v1[0] * v2[1]) - (v2[0] * v1[1])
    ]);
}

export function dotProduct(v1, v2){
    return (v2[0] * v1[0]) + (v2[1] * v1[1]) + (v2[2] * v1[2]);
}