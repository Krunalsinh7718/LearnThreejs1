varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uColor;

#include ./includes/ambientLight.glsl
#include ./includes/directionalLight.glsl
#include ./includes/pointLight.glsl



void main(){

//normal
vec3 normal = normalize(vNormal);

//color
vec3 color = uColor;

//view direction
vec3 viewDirection = normalize(vPosition - cameraPosition);

//light
vec3 light = vec3(0.0);
light += ambientLight(
    vec3(1.0) , //Light color
    0.03                //Light intensity
);
light += directionalLight(
    vec3(0.1,0.1,1.0),      //Light color
    1.0,                    //Light intensity
    normal,                 //Normal
    vec3(0.0, 0.0, 3.0),     //Light position
    viewDirection,           //view Direction
    20.0                    //specularPower      
);
light += pointLight(
    vec3(1.0,0.1,0.1),      //Light color
    1.0,                    //Light intensity
    normal,                 //Normal
    vec3(0.0, 2.5, 0.0),     //Light position
    viewDirection,           //view Direction
    20.0,                    //specularPower      
    vPosition,               //position
    0.25                      //light decay
);

light += pointLight(
    vec3(0.1,1.0,0.5),      //Light color
    1.0,                    //Light intensity
    normal,                 //Normal
    vec3(0.0, -2.5, -2.0),     //Light position
    viewDirection,           //view Direction
    20.0,                    //specularPower      
    vPosition,               //position
    0.25                      //light decay
);
color *= light;


// Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}