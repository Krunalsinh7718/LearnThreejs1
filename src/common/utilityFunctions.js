import * as THREE from 'three';

function textureRepeat(texture, repeatCountX, repeatCountY, wrapT = true){
    texture.repeat.set(repeatCountX, repeatCountY);

    texture.wrapS = THREE.RepeatWrapping;
    if(wrapT){
        texture.wrapT = THREE.RepeatWrapping;
    }
}

function blenderToThree([x, y, z]) {
  return new THREE.Vector3(
    x,   // X stays X
    z,   // Z → Y
    -y   // Y → -Z
  );
}

export { textureRepeat, blenderToThree}