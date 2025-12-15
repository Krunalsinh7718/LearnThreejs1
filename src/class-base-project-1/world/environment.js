import * as THREE from "three";
import Experience from "../experience.js";


export default class Environment {
    constructor() {
       this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resource;
        this.debug = this.experience.debug;
        if(this.debug.active){
            this.debugFolder = this.debug.ui.addFolder('environment');
        }
        this.setSunLight();
        this.setEnvironmentMap();
    }
    setSunLight() {
        this.sunLight = new THREE.DirectionalLight('#fff', 10);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set(1024, 1024);
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(3, 3, - 2.25)
        this.scene.add(this.sunLight);


        
        if(this.debug.active){
            this.lightCamera = new THREE.DirectionalLightHelper(this.sunLight);
            this.scene.add(this.lightCamera)
    
            const shadowHelper = new THREE.CameraHelper(this.sunLight.shadow.camera);
            this.scene.add(shadowHelper)


            this.debugFolder.add(this.sunLight, 'intensity').name('sunlightIntensity').min(0).max(10).step(0.001);
            this.debugFolder.add(this.sunLight.position, 'x').name('sunlightPositionX').min(0).max(10).step(0.001);
            this.debugFolder.add(this.sunLight.position, 'y').name('sunlightPositionY').min(0).max(10).step(0.001);
            this.debugFolder.add(this.sunLight.position, 'z').name('sunlightPositionZ').min(0).max(10).step(0.001);
        }

    }
    setEnvironmentMap(){
        this.environmentMap = {};
        this.environmentMap.intensity = 0.4;
        this.environmentMap.texture = this.resources.items.environmentMapTexture;
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;
        this.scene.environment = this.environmentMap.texture;
        this.environmentMap.updateMaterials = () => {
            this.scene.traverse(child => {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
                    child.material.envMap = this.environmentMap.texture;
                    child.material.envMapIntensity = this.environmentMap.intensity;
                    child.material.needsUpdate = true;
                }
            })
        }
        this.environmentMap.updateMaterials()

        if(this.debug.active){
            this.debugFolder.add(this.environmentMap, 'intensity').name('environmentMapIntensity').min(0).max(10).step(0.001).onChange(this.environmentMap.updateMaterials);
        }
    }


}