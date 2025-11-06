import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from "gsap";
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import GUI from 'lil-gui';

// GUI setup
const gui = new GUI();


//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 2); // Move the camera up and back
camera.lookAt(0, 0, 0);

//renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//Ambient Light (soft overall light)
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);


//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//animation loop

const clock = new THREE.Clock()

function animate() {
    renderer.render(scene, camera);
}

//handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});