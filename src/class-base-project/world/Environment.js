import * as THREE from 'three';
import Experience from "../experience.js";

export default class Environment {
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;   
       
        this.setSunLight();
    }

    setSunLight() {
        const sunLight = new THREE.DirectionalLight(0xffffff, 1);
        sunLight.position.set(5, 5, 5);
        this.scene.add(sunLight);
    }
}