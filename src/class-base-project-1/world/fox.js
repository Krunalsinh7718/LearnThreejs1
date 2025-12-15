import * as THREE from "three";
import Experience from "../experience.js";

export default class Fox{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resource.items;
        
        this.setModal();

        this.setAnimation();
    }
    
    setModal(){
        this.modal = this.resources.foxModel.scene;
        console.log("modal : ", this.modal);
        
        this.modal.scale.set(0.02, 0.02, 0.02);
        this.scene.add(this.modal);
    }

    setAnimation(){
        this.animation = {};
        this.animation.animationMixer = new THREE.AnimationMixer( this.modal)
    }
}