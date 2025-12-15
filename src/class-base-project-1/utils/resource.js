import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import EventEmitter from "../../common/EventEmmeter.js";

export default class Resource extends EventEmitter{
    constructor(sources){
        super();
        this.sources = sources;

        //setup
        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders(){
        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.textureLoader = new THREE.TextureLoader();
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    }

    startLoading(){
        for(const source of this.sources){
            if(source.type === "cubeTexture"){
                this.loaders.cubeTextureLoader.load(source.path, 
                    (file) => {
                        this.sourceLoaded(source, file);
                    }
                )
            }
            if(source.type === "texture"){
                this.loaders.textureLoader.load(source.path, 
                    (file) => {
                        this.sourceLoaded(source, file);
                    }
                )

            }
            if(source.type === "gltfModel"){
                this.loaders.gltfLoader.load(source.path, 
                    (file) => {
                        this.sourceLoaded(source, file);
                    }
                )
            }
        }
    }

    sourceLoaded(source, file){
        this.items[source.name] = file;
        this.loaded++;

        if(this.loaded === this.toLoad){
            this.trigger("ready");
        }
    }
}