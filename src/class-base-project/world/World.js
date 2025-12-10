import * as THREE from 'three';
import Experience from "../experience.js";

export default class World{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;        

        const textMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshStandardMaterial({color: 0xff0000})
        );
        this.scene.add(textMesh
        )
    }
}