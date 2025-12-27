

varying vec2 vUv;
varying float umouse;

void main(){

    vec4 pos = modelMatrix * vec4(position, 1.0);  
    
    gl_Position = projectionMatrix * viewMatrix * pos;


    vUv = uv; 

}


