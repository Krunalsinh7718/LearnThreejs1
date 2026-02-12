
// varying vec3 vModalPosition;
// varying vec3 vNormal;

// void main(){

//     //position
//    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
//     //final position
//    gl_Position = projectionMatrix * viewMatrix * modelPosition;

//     //modal normal
//     vec4 modelNormal = modelPosition * vec4(normal, 1.0);

//    vModalPosition = modelPosition.xyz;
//     vNormal = modelNormal.xyz;
// }




varying vec3 vPosition;
varying vec3 vNormal;

void main(){

    //position
   vec4 modelPosition = modelMatrix * vec4(position, 1.0);

   //modal normal
   vec4 modelNormal = modelPosition * vec4(normal,0.0);
    
    //final position
   gl_Position = projectionMatrix * viewMatrix * modelPosition;


     // Varyings
    vPosition = modelPosition.xyz;
    vNormal = normal;
    
}




