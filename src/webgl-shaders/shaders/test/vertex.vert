
uniform mat4 projectionMatrix; 
uniform mat4 viewMatrix;       
uniform mat4 modelMatrix;      

attribute vec3 position;

float sum(float a, float b){
    return a + b;
}

void main(){

    vec4 pos = modelMatrix * vec4(position, 1.0);
    pos.z += sin(pos.x * 20.0) * 0.1;
    
    gl_Position = projectionMatrix * viewMatrix * pos;
}


