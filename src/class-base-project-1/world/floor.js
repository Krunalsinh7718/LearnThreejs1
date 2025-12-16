import * as THREE from "three";
import Experience from "../experience.js";

export default class Floor{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resource;
        this.timer = this.experience.timer;

        this.activeRotate = false;
        this.activeRotateSpeed = 0.0001;

        this.setGeometry();
        this.setTexture();
        this.setMaterial();
        this.setMesh();
    }
    setGeometry(){
        this.geometry = new THREE.SphereGeometry(10,64,64);
    }
    setTexture(){
        this.texture = {};
        
        this.texture.color = this.resources.items.grassColorTexture;
        this.texture.color.colorSpace = THREE.SRGBColorSpace;
        this.texture.color.repeat.set(1.5, 1.5)
        this.texture.color.wrapS = THREE.RepeatWrapping
        this.texture.color.wrapT = THREE.RepeatWrapping

        this.texture.normal = this.resources.items.grassNormalTexture;
        this.texture.normal.repeat.set(1.5, 1.5)
        this.texture.normal.wrapS = THREE.RepeatWrapping
        this.texture.normal.wrapT = THREE.RepeatWrapping
    }
    setMaterial(){
        this.material = new THREE.MeshStandardMaterial({
            map: this.texture.color,
            normalMap: this.texture.normal
        });
        
    }
    setMesh(){
        
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.y = -10;
        this.mesh.receiveShadow = true;
        // console.log(this.mesh);
        this.scene.add(this.mesh)
    }
    update(){
        if(this.activeRotate){
            this.mesh.rotation.x -= this.timer.delta * this.activeRotateSpeed;
        }
    }

    
}