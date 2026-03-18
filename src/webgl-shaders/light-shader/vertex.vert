varying vec3 vNormal;
varying vec3 vPosition;


void main(){
    

    // Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    

    //varying
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
    vNormal = modelNormal.xyz; 
    vPosition = modelPosition.xyz;

   
}




