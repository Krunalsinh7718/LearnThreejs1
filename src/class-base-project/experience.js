import * as THREE from 'three';
import Camera from "./camera.js";
import Renderer from "./renderer.js";
import Sizes from "./sizes.js";
import Time from "./time.js";
import World from './world/World.js';
import Environment from './world/Environment.js';
import Resources from './utils/Resources.js';
import sources  from './sources.js';

let instance = null
export default class Experience {
    constructor(canvas) {

        
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this

        window.experience = this;

        this.canvas = canvas;
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();
        this.environment = new Environment();
        this.resources = new Resources(sources);
        // console.log(this.canvas);
        

        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        this.time.on('tick',() => {
            this.update();
        })

    }
    resize() {
        this.camera.resize();
        this.renderer.resize();
    }
    update(){
        this.camera.update();
        this.renderer.update();
    }
}