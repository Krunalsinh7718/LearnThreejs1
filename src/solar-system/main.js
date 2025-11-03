import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from "gsap";
import { createSphere } from './utility-functions.js';
import { time } from 'three/tsl';
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
    venus: {name : "Venus", radius: 0.05, distance: 10, color: 0xffcc66, orbitTime: 6.2 },
    earth: {name : "Earth", radius: 0.05, distance: 15, color: 0x3366ff, orbitTime: 10 },
    mars: {name : "Mars", radius: 0.03, distance: 22, color: 0xff3300, orbitTime: 18.8 },
    jupiter: {name : "Jupiter", radius: 0.5, distance: 78, color: 0xff9966, orbitTime: 119 },
    saturn: {name : "Saturn", radius: 0.4, distance: 140, color: 0xffcc99, orbitTime: 294 },
    uranus: {name : "Uranus", radius: 0.17, distance: 280, color: 0x66ccff, orbitTime: 840 },
    neptune: {name : "Neptune", radius: 0.16, distance: 450, color: 0x3366cc, orbitTime: 1650 }
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

// const mercury = new Planet(planetsData.mercury, {
//     color: planetsData.mercury.color,
//     emissive: planetsData.mercury.color,
//     emissiveIntensity: 0.01
// });
// mercuryOrbit.add(mercury);

const mercury = createSphere(planetsData.mercury.radius, {
    color: planetsData.mercury.color,
    emissive: planetsData.mercury.color,
    emissiveIntensity: 1
}, { x: planetsData.mercury.distance, y: 0, z: 0 });
mercuryOrbit.add(mercury);
// solarSystemObjects.push(mercury);
planetsData.mercury.planetGroup = mercury;


planetsData.mercury.planetGroup = mercury;

const venusOrbit = new THREE.Object3D();
solarSystem.add(venusOrbit);
solarSystemObjects.push(venusOrbit);

const venus = createSphere(planetsData.venus.radius, {
    color: planetsData.venus.color,
    emissive: planetsData.venus.color,
    emissiveIntensity: 1
}, { x: planetsData.venus.distance, y: 0, z: 0 });
venusOrbit.add(venus);
// solarSystemObjects.push(venus);
planetsData.venus.planetGroup = venus;

const earthOrbit = new THREE.Object3D();
solarSystem.add(earthOrbit);
solarSystemObjects.push(earthOrbit);

const earth = createSphere(planetsData.earth.radius, {
    color: planetsData.earth.color,
    emissive: planetsData.earth.color,
    emissiveIntensity: 1
}, { x: planetsData.earth.distance, y: 0, z: 0 });
earthOrbit.add(earth);
// solarSystemObjects.push(earth);
planetsData.earth.planetGroup = earth;

const marsOrbit = new THREE.Object3D();
solarSystem.add(marsOrbit);
solarSystemObjects.push(marsOrbit);

const mars = createSphere(planetsData.mars.radius, {
    color: planetsData.mars.color,
    emissive: planetsData.mars.color,
    emissiveIntensity: 1
}, { x: planetsData.mars.distance, y: 0, z: 0 });
marsOrbit.add(mars);
// solarSystemObjects.push(mars);
planetsData.mars.planetGroup = mars;

const jupiterOrbit = new THREE.Object3D();
solarSystem.add(jupiterOrbit);
solarSystemObjects.push(jupiterOrbit);

const jupiter = createSphere(planetsData.jupiter.radius, {
    color: planetsData.jupiter.color,
    emissive: planetsData.jupiter.color,
    emissiveIntensity: 1
}, { x: planetsData.jupiter.distance, y: 0, z: 0 });
jupiterOrbit.add(jupiter);
// solarSystemObjects.push(jupiter);
planetsData.jupiter.planetGroup = jupiter;

const saturnOrbit = new THREE.Object3D();
solarSystem.add(saturnOrbit);
solarSystemObjects.push(saturnOrbit);

const saturn = createSphere(planetsData.saturn.radius, {
    color: planetsData.saturn.color,
    emissive: planetsData.saturn.color,
    emissiveIntensity: 1
}, { x: planetsData.saturn.distance, y: 0, z: 0 });
saturnOrbit.add(saturn);
// solarSystemObjects.push(saturn);
planetsData.saturn.planetGroup = saturn;

const uranusOrbit = new THREE.Object3D();
solarSystem.add(uranusOrbit);
solarSystemObjects.push(uranusOrbit);

const uranus = createSphere(planetsData.uranus.radius, {
    color: planetsData.uranus.color,
    emissive: planetsData.uranus.color,
    emissiveIntensity: 1
}, { x: planetsData.uranus.distance, y: 0, z: 0 });
uranusOrbit.add(uranus);
// solarSystemObjects.push(uranus);
planetsData.uranus.planetGroup = uranus;

const neptuneOrbit = new THREE.Object3D();
solarSystem.add(neptuneOrbit);
solarSystemObjects.push(neptuneOrbit);
const neptune = createSphere(planetsData.neptune.radius, {
    color: planetsData.neptune.color,
    emissive: planetsData.neptune.color,
    emissiveIntensity: 1
}, { x: planetsData.neptune.distance, y: 0, z: 0 });
neptuneOrbit.add(neptune);
// solarSystemObjects.push(neptune);
planetsData.neptune.planetGroup = neptune;

// scene.add(sun, earth, mercury, venus, mars, jupiter, saturn, uranus, neptune);

// Ambient Light (soft overall light)
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

// Directional Light (like sunlight)
// const dirLight = new THREE.DirectionalLight(0xffffff, 1);
// dirLight.position.set(5, 20, 5);
// scene.add(dirLight);

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

        const { distance, orbitTime, planetGroup } = value;
        

        if (orbitTime === 0) continue;
        const angle = (elapsed / orbitTime) * Math.PI * 2; 
        planetGroup.position.set(
            Math.cos(angle) * distance,
            0,
            Math.sin(angle) * distance
        );

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