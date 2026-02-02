
uniform sampler2D uPerlinNoise;
uniform float uTime;

varying vec2 vUv;

vec2 rotate2D(vec2 value, float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
}


void main(){

    vec3 smokePos = position;


    float noise = texture(uPerlinNoise, 
    vec2(
        0.5,
        uv.y * 0.2 - uTime * 0.005
    )).r;
    float angle = noise * 10.0;

    smokePos.xz = rotate2D(smokePos.xz, angle);

    vec2 windOffset = vec2(
        texture(uPerlinNoise, vec2(0.25, uTime * 0.01)).r - 0.5,
        texture(uPerlinNoise, vec2(0.75, uTime * 0.01)).r - 0.5
    );
    windOffset *= pow(uv.y, 2.0) * 10.0;
    smokePos.xz += windOffset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(smokePos, 1.0);

    vUv = uv;
}