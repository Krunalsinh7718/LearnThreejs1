precision mediump float;

varying float vElevation;

uniform sampler2D uTexture;
varying vec2 vUv;


void main(){
    vec4 flagColor = texture2D(uTexture, vUv);
    flagColor.rgb *= vElevation * 1.0 + 0.8;
    // gl_FragColor = vec4(sampler2D, 1.0);
    gl_FragColor = flagColor;
}