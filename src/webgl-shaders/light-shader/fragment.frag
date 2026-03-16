vec3 ambientLight(vec3 light, float intensity){
    return light * intensity;
}
void main(){

//color
vec3 color = vec3(0.0, 0.0, 0.0);

//light
vec3 light = ambientLight(vec3(1.0, 0.3, 0.0) , 0.2);
color *= light;


// Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}