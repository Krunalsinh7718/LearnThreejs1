uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform vec2 uFrequency;

attribute vec3 position;
attribute float aRandom;
attribute vec2 uv;

varying float vElevation;
varying vec2 vUv;

void main(){

    vec4 pos = modelMatrix * vec4(position, 1.0);  

    float elevation = sin(pos.x * uFrequency.x - uTime ) * 0.1; 
    elevation += sin(pos.y * uFrequency.y - uTime) * 0.1; 
    pos.z += elevation;
    // pos.z += aRandom * 0.1; 
    gl_Position = projectionMatrix * viewMatrix * pos;

    vElevation = elevation ;

    vUv = uv; 

}


