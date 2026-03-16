uniform sampler2D uTexture;
uniform vec3 uColor;

void main(){
//image
vec4 image = texture(uTexture, gl_PointCoord);



// Final color
    gl_FragColor = vec4(uColor, image.r);
    // gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}