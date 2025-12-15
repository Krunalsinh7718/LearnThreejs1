import * as THREE from "three";
import Experience from "./experience.js";


export default class Environment {
    constructor() {
       this.experience = new Experience();
        this.scene = this.experience.scene;


        this.setSunLight();
    }
    setSunLight() {
        this.sunLight = new THREE.DirectionalLight('#fff', 10);
        this.sunLight.castShadow = true;
        this.sunLight.position.set(5,5,5)
        this.scene.add(this.sunLight);


        this.lightCamera = new THREE.DirectionalLightHelper(this.sunLight);
        this.scene.add(this.lightCamera)


    }
}