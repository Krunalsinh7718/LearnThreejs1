import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from "gsap";
import { createSphere } from './utility-functions.js';
import { log, time } from 'three/tsl';
import { Planet } from './planetClass.js';

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 0); // Move the camera up and back
camera.lookAt(0, 0, 0);



//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//mesh setup
const planetsData = {
    sun: {name : "Sun", radius: 5, distance: 0, color: 0xffff00, orbitTime: 0 },
    mercury: {name : "Mercury", radius: 0.02, distance: 6, color: 0xaaaaaa, orbitTime: 2.4 },
    // venus: {name : "Venus", radius: 0.05, distance: 10, color: 0xffcc66, orbitTime: 6.2 },
    // earth: {name : "Earth", radius: 0.05, distance: 15, color: 0x3366ff, orbitTime: 10 },
    // mars: {name : "Mars", radius: 0.03, distance: 22, color: 0xff3300, orbitTime: 18.8 },
    // jupiter: {name : "Jupiter", radius: 0.5, distance: 78, color: 0xff9966, orbitTime: 119 },
    // saturn: {name : "Saturn", radius: 0.4, distance: 140, color: 0xffcc99, orbitTime: 294 },
    // uranus: {name : "Uranus", radius: 0.17, distance: 280, color: 0x66ccff, orbitTime: 840 },
    // neptune: {name : "Neptune", radius: 0.16, distance: 450, color: 0x3366cc, orbitTime: 1650 }
};

const solarSystemObjects = [];

const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
solarSystemObjects.push(solarSystem);

const sun = createSphere(planetsData.sun.radius, {
    color: planetsData.sun.color,
    emissive: planetsData.sun.color,
    emissiveIntensity: 2
}, { x: planetsData.sun.distance, y: 0, z: 0 });
solarSystem.add(sun);
// solarSystemObjects.push(sun);
planetsData.sun.planetGroup = sun;

const mercuryOrbit = new THREE.Object3D();
solarSystem.add(mercuryOrbit);
solarSystemObjects.push(mercuryOrbit);

const mercury = new Planet(planetsData.mercury, {
    color: planetsData.mercury.color,
    emissive: planetsData.mercury.color,
    emissiveIntensity: 0.01
});
mercuryOrbit.add(mercury.group);

// const mercury = createSphere(planetsData.mercury.radius, {
//     color: planetsData.mercury.color,
//     emissive: planetsData.mercury.color,
//     emissiveIntensity: 1
// }, { x: planetsData.mercury.distance, y: 0, z: 0 });
// mercuryOrbit.add(mercury);
// solarSystemObjects.push(mercury);
planetsData.mercury.planetGroup = mercury;





// Ambient Light (soft overall light)
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

//point light
const light = new THREE.PointLight(0xffffff, 100);
light.position.set(0, 0, 0);
scene.add(light);

// Light helper (to visualize the light)
// const helper = new THREE.DirectionalLightHelper(dirLight, 1);
// scene.add(helper);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

//other
const clock = new THREE.Clock();

//animation loop
function animate() {

    const elapsed = clock.getElapsedTime();

    controls.update();

    for (const [key, value] of Object.entries(planetsData)) {
        if (value.orbitTime === 0 && value.planetGroup) continue;

        const { distance, orbitTime, planetGroup : {group : planetGroup}} = value;
        
        if (orbitTime === 0) continue;
        const angle = (elapsed / orbitTime) * Math.PI * 2; 
        // planetGroup.position.set(
        //     Math.cos(angle) * distance,
        //     0,
        //     Math.sin(angle) * distance
        // );

        planetGroup.label && (planetGroup.label.lookAt(camera.position));

        if (planetGroup.ring) {
            const distToCam = planetGroup.group.position.distanceTo(camera.position);
            const scaleFactor = distToCam * 0.015; 
            planetGroup.label.scale.set(scaleFactor, scaleFactor / 2, 1);
            planetGroup.ring.scale.set(scaleFactor * 0.1, scaleFactor * 0.1, scaleFactor * 0.1);
        }


    }
    renderer.render(scene, camera);
}

//handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});