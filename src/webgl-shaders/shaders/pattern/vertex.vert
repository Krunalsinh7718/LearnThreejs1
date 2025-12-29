

varying vec2 vUv;
uniform float uTime;

void main(){

    vec4 pos = modelMatrix * vec4(position, 1.0);  

    float elevation = sin(pos.x * 20.1 - sin(uTime * 1.3) + uTime ) * 0.1; 
    elevation += sin(pos.y * 10.2 - sin(uTime * 2.0) + uTime) * 0.1; 
    pos.z += elevation;
    
    gl_Position = projectionMatrix * viewMatrix * pos;


    vUv = uv; 

}


