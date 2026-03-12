varying vec3 vPosition;
varying vec3 vNormal;
uniform vec3 uColor;

uniform float uTime;

void main(){

  // Normal
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing)
        normal *= - 1.0;

  //view direction
  vec3 viewDirection = normalize(vPosition - cameraPosition);

  //fresnel
  float fresnel = dot(viewDirection, normal) + 1.0;

   // Falloff
    float falloff = smoothstep(0.8, 0.0, fresnel);

  //stript
  float stripe = mod( (vPosition.y - (uTime * 0.02)) * 20.0, 1.0);
  stripe = pow(stripe, 3.0);

  //holographic 
  float holographic = stripe * fresnel;
  holographic += fresnel * 1.25;
  holographic *= falloff;

  // gl_FragColor = vec4(vec3(stripe), 1.0);
  gl_FragColor = vec4(uColor, holographic);
  // gl_FragColor = vec4(viewDirection, 1.0);
  #include <tonemapping_fragment>
    #include <colorspace_fragment>
}