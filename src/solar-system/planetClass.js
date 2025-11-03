import * as THREE from 'three';
import { createSphere, createRing, createTextLabel } from '../solar-system/utility-functions.js';

class Planet {
    constructor(data, materialOptions = {}) {
        this.group = new THREE.Group();

        this.mesh = createSphere(data.radius, materialOptions, { x: data.distance, y: 0, z: 0 });

        this.group.add(this.mesh);

        this.ring = createRing(data);
        this.group.add(this.ring);

        this.label = createTextLabel(data.name);
        // this.label.position.set(0, data.radius * 10, 0);
        // console.log("label :",this.label);
        
        this.group.add(this.label);
    }
}


export { Planet };