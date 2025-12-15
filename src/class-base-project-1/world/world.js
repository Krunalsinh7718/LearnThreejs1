import * as THREE from "three"; 
import Experience from "../experience";
import Floor from "./floor.js";
import Fox from "./Fox.js";
import Environment from "./environment.js";



export default class World {
    constructor() {
        
        this.experience = new Experience();
        this.resource = this.experience.resource

        this.resource.on('ready', () => {
            this.floor = new Floor();
            this.fox = new Fox();
            this.environment = new Environment();
        })
        
    }

    update(){
        if(this.fox){
            this.fox.update();
        }
    }
   
}