varying vec3 vPosition;
varying vec3 vNormal;

uniform float uTime;
uniform vec3 uColor;

void main(){

    //normal
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing){
        normal *= -1.0;
    }

    //stripes
    float stripes = mod((vPosition.y - uTime * 0.02) * 10.0 , 1.0);
    stripes = pow(stripes, 2.0);

    //Fresnal
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnal = dot(viewDirection, normal) + 1.0;
    fresnal = pow(fresnal, 2.0);

    //Fallof
    float falloff = smoothstep(0.8, 0.0, fresnal);

    //holographic
    float holographic = stripes * fresnal;
    holographic += fresnal * 1.25;
    holographic *= falloff;


    //final color
    gl_FragColor = vec4(uColor, holographic);
    // gl_FragColor = vec4(vNormal, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}