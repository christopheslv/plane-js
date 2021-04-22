import * as vec from './vec3.js';

export function identity(){
    return new Float32Array( [ 
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
}

export function perspective(fovyRadians, aspect, nearZ, farZ){
    let cotan = 1.0 / Math.tan(fovyRadians / 2.0);

    return new Float32Array( [ 
        cotan / aspect, 0.0, 0.0, 0.0,
        0.0, cotan, 0.0, 0.0,
        0.0, 0.0, (farZ + nearZ) / (nearZ - farZ), -1.0,
        0.0, 0.0, (2.0 * farZ * nearZ) / (nearZ - farZ), 0.0 
    ]);
}

export function ortho(left, right, bottom, top, nearZ, farZ){
    let ral = right + left;
    let rsl = right - left;
    let tab = top + bottom;
    let tsb = top - bottom;
    let fan = farZ + nearZ;
    let fsn = farZ - nearZ;

    return new Float32Array( [ 
        2.0 / rsl, 0.0, 0.0, -ral / rsl,
        0.0, 2.0 / tsb, 0.0, -tab / tsb,
        0.0, 0.0, -2.0 / fsn, -fan / fsn,
        0.0, 0.0, 0.0, 1.0
    ]);
}

export function lookAt( eye, target, up)
{
    let m = new Float32Array(16);
    let vUp = vec.normalize(up);

    let zaxis = vec.normalize(vec.sub(eye,target));
    let xaxis = vec.normalize(vec.crossProduct(vUp,zaxis));
    let yaxis = vec.normalize(vec.crossProduct(zaxis,xaxis));

    m[0] = xaxis[0];
    m[1] = yaxis[0];
    m[2] = zaxis[0];
    m[3] = 0.0;
    
    m[4] = xaxis[1];
    m[5] = yaxis[1];
    m[6] = zaxis[1];
    m[7] = 0.0;
    
    m[8] = xaxis[2];
    m[9] = yaxis[2];
    m[10] = zaxis[2];
    m[11] = 0.0;
    
    m[12] = -vec.dotProduct(xaxis, eye);
    m[13] = -vec.dotProduct(yaxis, eye);
    m[14] = -vec.dotProduct(zaxis, eye);
    m[15] = 1.0;

    return m;
}

export function translation(tvec)
{
    return new Float32Array( [ 
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        tvec[0], tvec[1], tvec[2], 1.0
    ]);
}

export function eulerRotation(rvec)
{
    let rX = identity();
    let rY = identity();
    let rZ = identity();

    rX[5] = Math.cos(rvec[0]);
    rX[6] = -Math.sin(rvec[0]);
    rX[9] = Math.sin(rvec[0]);
    rX[10] = Math.cos(rvec[0]);

    rY[0] = Math.cos(rvec[1]);
    rY[2] = Math.sin(rvec[1]);
    rY[8] = -Math.sin(rvec[1]);
    rY[10] = Math.cos(rvec[1]);

    rZ[0] = Math.cos(rvec[2]);
    rZ[1] = -Math.sin(rvec[2]);
    rZ[4] = Math.sin(rvec[2]);
    rZ[5] = Math.cos(rvec[2]);

    return multiply(rX, multiply(rY, rZ));
}

export function multiply(mleft, mright){
    let m = new Float32Array(16);

    m[0]  = mleft[0] * mright[0]  + mleft[4] * mright[1]  + mleft[8] * mright[2]   + mleft[12] * mright[3];
	m[4]  = mleft[0] * mright[4]  + mleft[4] * mright[5]  + mleft[8] * mright[6]   + mleft[12] * mright[7];
	m[8]  = mleft[0] * mright[8]  + mleft[4] * mright[9]  + mleft[8] * mright[10]  + mleft[12] * mright[11];
	m[12] = mleft[0] * mright[12] + mleft[4] * mright[13] + mleft[8] * mright[14]  + mleft[12] * mright[15];

	m[1]  = mleft[1] * mright[0]  + mleft[5] * mright[1]  + mleft[9] * mright[2]   + mleft[13] * mright[3];
	m[5]  = mleft[1] * mright[4]  + mleft[5] * mright[5]  + mleft[9] * mright[6]   + mleft[13] * mright[7];
	m[9]  = mleft[1] * mright[8]  + mleft[5] * mright[9]  + mleft[9] * mright[10]  + mleft[13] * mright[11];
	m[13] = mleft[1] * mright[12] + mleft[5] * mright[13] + mleft[9] * mright[14]  + mleft[13] * mright[15];

	m[2]  = mleft[2] * mright[0]  + mleft[6] * mright[1]  + mleft[10] * mright[2]  + mleft[14] * mright[3];
	m[6]  = mleft[2] * mright[4]  + mleft[6] * mright[5]  + mleft[10] * mright[6]  + mleft[14] * mright[7];
	m[10] = mleft[2] * mright[8]  + mleft[6] * mright[9]  + mleft[10] * mright[10] + mleft[14] * mright[11];
	m[14] = mleft[2] * mright[12] + mleft[6] * mright[13] + mleft[10] * mright[14] + mleft[14] * mright[15];

	m[3]  = mleft[3] * mright[0]  + mleft[7] * mright[1]  + mleft[11] * mright[2]  + mleft[15] * mright[3];
	m[7]  = mleft[3] * mright[4]  + mleft[7] * mright[5]  + mleft[11] * mright[6]  + mleft[15] * mright[7];
	m[11] = mleft[3] * mright[8]  + mleft[7] * mright[9]  + mleft[11] * mright[10] + mleft[15] * mright[11];
	m[15] = mleft[3] * mright[12] + mleft[7] * mright[13] + mleft[11] * mright[14] + mleft[15] * mright[15];

    return m;
}