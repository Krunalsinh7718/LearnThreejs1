uniform sampler2D uTexture;

void main(){
//image
vec4 image = texture(uTexture, gl_PointCoord);



// Final color
    gl_FragColor = vec4(1.0, 1.0, 1.0, image.r);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}