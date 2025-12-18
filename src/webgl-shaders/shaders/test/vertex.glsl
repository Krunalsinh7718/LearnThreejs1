 uniform mat4 projectionMatrix
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;

void main(){
    gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4(position, 1.0);
}