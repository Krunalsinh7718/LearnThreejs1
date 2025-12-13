import * as THREE from "three"; 
import Experience from "../experience";
import Floor from "./floor.js";


export default class World {
    constructor() {
        
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.floor = new Floor();
        
        // this.testMesh();
    }
    testMesh(){
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial({
                color: "red"
            })
        )
        this.scene.add(mesh)
    }
}