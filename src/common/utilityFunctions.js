import * as THREE from 'three';

function textureRepeat(texture, repeatCountX, repeatCountY, wrapT = true){
    texture.repeat.set(repeatCountX, repeatCountY);

    texture.wrapS = THREE.RepeatWrapping;
    if(wrapT){
        texture.wrapT = THREE.RepeatWrapping;
    }
}

export { textureRepeat}