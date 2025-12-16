import * as THREE from "three";
import Camera from "./camera.js";
import Sizes from "./sizes.js";

import Renderer from "./renderer.js";
import Timer from "./timer.js";
import World from "./world/World.js";
import sources from "./sources.js";
import Resource from "./utils/resource.js";
import Debug from "./utils/debug.js";


let instance = null;
export default class Experience {
    constructor(canvas) {
        if(instance){
            return instance;
        }
        instance = this;
        window.experience = this;

        this.canvas = canvas;
        this.timer = new Timer();
        this.sizes = new Sizes();
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        
        this.resource = new Resource(sources);
        this.renderer = new Renderer();
        this.world = new World();
        this.debug = new Debug();

        this.timer.on('tick', () => {
            this.update();
        })

        this.sizes.on('resize', () => {
            this.resize();
        })
    }

    update(){
        this.camera.update();
        this.renderer.update();
        this.world.update();
    }
    resize(){
        this.camera.resize();
        this.renderer.resize();
    }
    destroy(){
        this.timer.off('tick');
        this.sizes.off('resize');
        this.scene.traverse(child => {
            if(child instanceof THREE.Mesh){
                child.geometry.dispose();

                for(const key in child.material){
                    const value = child.material[key];

                    if(value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })
        this.camera.controls.dispose();
        this.renderer.renderer.dispose();

        if(this.debug.active){
            this.debug.ui.destroy();
        }

    }
}