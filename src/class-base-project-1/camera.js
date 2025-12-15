import * as THREE from 'three';
import Experience from './experience.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        
        this.setInstance();
        this.setOrbitControl();
        
        this.sizes.on('resize', () => {
            this.resize();
        });
    }
    
    setInstance(){
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 1000);
        this.instance.position.set(0,3,15)
        this.scene.add(this.instance);
    }

    setOrbitControl(){
        this.controls = new OrbitControls(this.instance, this.experience.canvas);
        this.controls.enableDamping = true;
    }
    resize(){
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }
    update(){
        this.controls.update();
    }
}