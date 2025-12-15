import * as THREE from "three";
import Camera from "./camera.js";
import Sizes from "./sizes.js";
import Environment from "./environment.js";
import Renderer from "./renderer.js";
import Timer from "./timer.js";
import World from "./world/World.js";
import sources from "./sources.js";
import Resource from "./utils/resource.js";


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
        this.environment = new Environment();
        this.resource = new Resource(sources);
        this.renderer = new Renderer();
        this.world = new World();

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
    }
    resize(){
        this.camera.resize();
        this.renderer.resize();
    }
}