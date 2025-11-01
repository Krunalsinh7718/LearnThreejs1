import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from "gsap";


//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // Move the camera up and back
camera.lookAt(0, 0, 0); 


const camParams = { angle: 0 }; // an object with a numeric property

// gsap.to(camera.position, {
//   duration: 4,
//   x: 5,
//   y: 3,
//   z: 5,
//   ease: "power2.inOut",
//   onUpdate: () => camera.lookAt(0, 0, 0),
//   yoyo: true,
//   repeat: -1
// });

gsap.to(camParams, {
  angle: Math.PI * 2,
  duration: 6,
  repeat: -1,
  ease: "none",
  onUpdate: () => {
    const radius = 5;
    camera.position.x = Math.sin(camParams.angle) * radius;
    camera.position.z = Math.cos(camParams.angle) * radius;
    camera.position.y = Math.sin(camParams.angle * 0.5) * 1.5;
    camera.lookAt(0, 0, 0);
  }
});

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//mesh setup
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Ambient Light (soft overall light)
const ambient = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambient);

// Directional Light (like sunlight)
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

//point light
// const light = new THREE.PointLight(0xffffff, 1);
// light.position.set(10, 10, 10);
// scene.add(light);

// Light helper (to visualize the light)
const helper = new THREE.DirectionalLightHelper(dirLight, 1);
// scene.add(helper);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.dampingFactor = 0.05;

//animation loop
function animate() {

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

   controls.update();

    renderer.render(scene, camera);
}

//handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});