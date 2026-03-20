

varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;


uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallIterations;


#include ./includes/perlinClassic3d.glsl
void main(){

    //base position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    //elevation
    float elevation = 
    sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) * 
    sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
    uBigWavesElevation;

    for(float i = 1.0; i <= uSmallIterations; i++){
        elevation -= abs(perlinClassic3d(
            vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)
            ) * uSmallWavesElevation / i);
    }
    modelPosition.y += elevation;

    //final positions
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    //varyings
    vUv = uv; 
    vElevation = elevation;
    vNormal = (modelMatrix * vec4(normal, 0.0)).xyz ;
    vPosition = modelPosition.xyz;

}


