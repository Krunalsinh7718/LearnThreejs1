import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from "gsap";


//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 0); // Move the camera up and back
camera.lookAt(0, 0, 0);



//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//mesh setup
let sun, earth;
{
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffff00,       // base yellow color
        emissive: 0xffaa00,    // glowing yellow-orange
        emissiveIntensity: 1   // make it bright
    });
    sun = new THREE.Mesh(geometry, material);
    scene.add(sun);
}
{
    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: "#004ad7" });
    earth = new THREE.Mesh(geometry, material);
    earth.position.set(3, 0, 0);
    scene.add(earth);
}

// Ambient Light (soft overall light)
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
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

//animation loop
function animate() {

    controls.update();


    renderer.render(scene, camera);
}

//handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});