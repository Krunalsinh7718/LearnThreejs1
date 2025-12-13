import * as THREE from "three";
import Experience from "./experience.js";


export default class Environment {
    constructor() {
       this.experience = new Experience();
        this.scene = this.experience.scene;


        this.setSunLight();
    }
    setSunLight() {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4);
        this.sunLight.castShadow = true;
        this.scene.add(this.sunLight);
    }
}