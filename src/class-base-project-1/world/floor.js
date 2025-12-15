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
        this.geometry = new THREE.CircleGeometry(5, 64);
        

    }
    setMaterial(){
        this.material = new THREE.MeshStandardMaterial();
        this.material.side = THREE.DoubleSide;
        this.material.color = new THREE.Color("red");
    }
    setMesh(){
        
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.x = - Math.PI * 0.5
        
        console.log(this.mesh);
        this.scene.add(this.mesh)
    }

    
}