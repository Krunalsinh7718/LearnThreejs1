import * as THREE from "three";
import Experience from "../experience.js";

export default class Floor{
    constructor(){
        this.Experience = new Experience();
        this.scene = this.Experience.scene;

        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }
    setGeometry(){
        // this.geometry = new THREE.CircleGeometry(5, 64);
        this.geometry = new THREE.BoxGeometry(1,1,1);


    }
    setMaterial(){
        this.material = new THREE.MeshBasicMaterial();
        this.material.color = "red";
    }
    setMesh(){
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh)
    }

    
}