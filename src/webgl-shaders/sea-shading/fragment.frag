
#define PI 3.1415926535897932384626433832795

varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

#include ./includes/directionalLight.glsl


void main(){
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);

    //light
    vec3 light = vec3(0.0);
    light += directionalLight(
        vec3(1.0),              //Light color
        1.0,                    //Light intensity
        normal,                 //Normal
        vec3(-1.0, 0.5, 0.0),   //Light position
        viewDirection,          //View Direction
        30.0                    //Specular power
    );

    //base color
    float mixStrength = (vElevation + uColorOffset ) * uColorMultiplier;
    mixStrength = smoothstep(0.0, 1.0, mixStrength);
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    color *= light;

    //final color
    gl_FragColor = vec4(vNormal, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}