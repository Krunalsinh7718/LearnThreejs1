// varying vec3 vModalPosition;
// varying vec3 vNormal;

// uniform float uTime;

// void main(){

//  float stripe =  mod((vModalPosition.y - uTime * 0.02) * 20.0, 1.0);
 
//  stripe = pow(stripe, 3.0);

//  //Fresnel
//  vec3 viewDirection = normalize(vModalPosition - cameraPosition);
//  float fresnel = dot(viewDirection, vNormal) + 1.0;

//   gl_FragColor = vec4(vec3(1.0), fresnel);
//   // gl_FragColor = vec4(vModalPosition, 1.0);
//   #include <tonemapping_fragment>
//   #include <colorspace_fragment>
// }


uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

void main(){

// Stripes
    float stripes = mod((vPosition.y - uTime * 0.03) * 20.0, 1.0);

    // Fresnel
    vec3 viewDirection =  normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, vNormal);

  // gl_FragColor = vec4(vec3(stripes), 1.0);
  // gl_FragColor = vec4(vNormal, stripes);
  gl_FragColor = vec4(vec3(1.0), fresnel);
 
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}