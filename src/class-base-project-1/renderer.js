import * as THREE from "three";
import Experience from "./experience";
import EventEmitter from "../common/EventEmmeter.js";

export default class Renderer extends EventEmitter {
    constructor() {
        super();
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.sizes = this.experience.sizes;

        this.setRenderer();

        this.sizes.on('resize', () => {
            this.resize();
        });
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.experience.canvas,
            antialias: true
        })
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
        // this.renderer.shadowMap.enabled = true;
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    resize(){
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
    }

    update(){
        this.renderer.render(this.scene, this.camera.instance)
    }

}