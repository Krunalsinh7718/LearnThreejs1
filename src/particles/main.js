import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from "gsap";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';

// GUI setup
// const gui = new GUI();
//loading manager
const lodingManager = new THREE.LoadingManager();
lodingManager.onStart = () => {
  console.log('Loading started');
};
lodingManager.onLoad = () => {
  console.log('Loading complete');
};
lodingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log(`Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
};
lodingManager.onError = (url) => {
  console.error(`There was an error loading ${url}`);
};

const textureLoader = new THREE.TextureLoader(lodingManager);
const particle = textureLoader.load('./assets/alpha/2.png')

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5); 
camera.lookAt(0, 0, 0);

//renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

/**
 * Particles
 */
const particlesGeometry = new THREE.BufferGeometry()
const count = 20000

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++) 
{
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) 
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)) 

const particlesMaterial = new THREE.PointsMaterial({
    // color: "#ff88cc",
    map: particle,
    transparent: true,
    alphaMap: particle,
    size: 0.1,
    sizeAttenuation: true,
    // alphaTest : 0.001
    // depthTest: false
    depthWrite : false,
    // blending: THREE.AdditiveBlending
    vertexColors: true
})
// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial()
)
scene.add(cube)

//lights
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

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


