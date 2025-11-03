import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from "gsap";
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';


//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // Move the camera up and back
camera.lookAt(0, 0, 0);

//renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// === Load Textures ===
async function loadSphere() {
  const textureLoader = new THREE.TextureLoader();

  // ✅ Load textures asynchronously
  const colorTexture = await textureLoader.loadAsync('./assets/textures1/rock_wall_15_diff_4k.jpg');
  const normalMap = await new EXRLoader().loadAsync('./assets/textures1/rock_wall_15_nor_gl_4k.exr');
  const roughnessMap = await new EXRLoader().loadAsync('./assets/textures1/rock_wall_15_rough_4k.exr');

  // ✅ Make sure normal map is recognized as such
  normalMap.colorSpace = THREE.NoColorSpace;
  roughnessMap.colorSpace = THREE.NoColorSpace;

  // ✅ Sphere geometry
  const sphereGeometry = new THREE.SphereGeometry(2, 64, 64);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    map: colorTexture,
    normalMap,             // use as normalMap, not displacement
    roughnessMap,
    roughness: 1.0,
    metalness: 0.0,
    displacementScale: 0.0 // disable since you used a normal map, not displacement
  });

  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(0, 0.5, 0);
  scene.add(sphere);
}

// loadSphere();

const textureLoader = new THREE.TextureLoader();
const colorMap = textureLoader.load('https://threejs.org/examples/textures/brick_diffuse.jpg');
const bumpMap = textureLoader.load('https://threejs.org/examples/textures/brick_bump.jpg');
const normalMap = textureLoader.load('https://threejs.org/examples/textures/brick_normal.jpg');
const roughnessMap = textureLoader.load('https://threejs.org/examples/textures/brick_roughness.jpg');

const material = new THREE.MeshStandardMaterial({
  map: colorMap,
  bumpMap: bumpMap,
  bumpScale: 0.05,
  normalMap: normalMap,
  roughnessMap: roughnessMap,
  roughness: 1.0,
  metalness: 0.0
});

const sphere1 = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), material);
scene.add(sphere1);

// Ambient Light (soft overall light)
const ambient = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambient);

// Directional Light (like sunlight)
const dirLight = new THREE.DirectionalLight(0xffffff, 5);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

const helper = new THREE.DirectionalLightHelper(dirLight, 1);
// scene.add(helper);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 5);
dirLight1.position.set(-5, 5, -5);
scene.add(dirLight1);

const helper1 = new THREE.DirectionalLightHelper(dirLight1, 1);
// scene.add(helper1);

//point light
// const light = new THREE.PointLight(0xffffff, 1);
// light.position.set(10, 10, 10);
// scene.add(light);

// Light helper (to visualize the light)

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.dampingFactor = 0.05;

//animation loop
function animate() {

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    // controls.update();

    renderer.render(scene, camera);
}

//handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});