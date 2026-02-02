
uniform sampler2D uPerlinNoise;
uniform float uTime;
varying vec2 vUv;

void main(){

    vec2 smokeUv = vUv;
    smokeUv.y -= uTime * 0.05;

    float noise = texture2D(uPerlinNoise, smokeUv).r;

    float fadeLeft = smoothstep(1.0, 0.8, vUv.x);
    float fadeRight = smoothstep(0.1, 0.3, vUv.x);
    float fadeUp = smoothstep(1.0, 0.8, vUv.y);
    float fadeDown = smoothstep(0.1, 0.3, vUv.y);
    float finalFade = fadeLeft * fadeRight * fadeUp * fadeDown * noise;


    gl_FragColor = vec4(1.0,1.0,1.0, finalFade);
}