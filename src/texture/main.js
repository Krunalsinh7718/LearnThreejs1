import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from "gsap";
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import GUI from 'lil-gui';

// GUI setup
const gui = new GUI();

//environment map

const hdrLoader = new HDRLoader()
hdrLoader.load('./assets/textures/environmentMap/2k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = environmentMap
    scene.environment = environmentMap
})

// Load textures
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
  console.log(`There was an error loading ${url}`);
};



const textureLoader = new THREE.TextureLoader(lodingManager)

const doorColorTexture = textureLoader.load('./assets/textures/door/color.jpg');
doorColorTexture.colorSpace = THREE.SRGBColorSpace
const doorAlphaTexture = textureLoader.load('./assets/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./assets/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./assets/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./assets/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./assets/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./assets/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('./assets/textures/matcaps/8.png');
matcapTexture.colorSpace = THREE.SRGBColorSpace
const gradientTexture = textureLoader.load('./assets/textures/gradients/5.jpg')

//basic material
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color = new THREE.Color("red");
// material.wireframe = true;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide

//normal material
// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true

//matcap material
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

//depth material
// const material = new THREE.MeshDepthMaterial();

//lambert material
// const material = new THREE.MeshLambertMaterial();

//phong material
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100
// gui.add( material, 'shininess', 0, 100 );
// material.specular = new THREE.Color(0xAA00FF);

//toon material
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture;

//standard material
// const material = new THREE.MeshStandardMaterial();
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.metalness = 1
// material.roughness = 1
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

//physical material
const material = new THREE.MeshPhysicalMaterial();
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
material.metalness = 0
material.roughness = 0
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture


// material.clearcoat = 1
// material.clearcoatRoughness = 0

// gui.add(material, 'clearcoat').min(0).max(1).step(0.0001)
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001)

// material.sheen = 1
// material.sheenRoughness = 0.25
// material.sheenColor.set(1, 1, 1)

// gui.add(material, 'sheen').min(0).max(1).step(0.0001)
// gui.add(material, 'sheenRoughness').min(0).max(1).step(0.0001)
// gui.addColor(material, 'sheenColor')

// material.iridescence = 1
// material.iridescenceIOR = 1
// material.iridescenceThicknessRange = [ 100, 800 ]

// gui.add(material, 'iridescence').min(0).max(1).step(0.0001)
// gui.add(material, 'iridescenceIOR').min(1).max(2.333).step(0.0001)
// gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1)
// gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1)

// // Transmission
material.transmission = 1
material.ior = 1.5
material.thickness = 0.5

gui.add(material, 'transmission').min(0).max(1).step(0.0001)
gui.add(material, 'ior').min(1).max(10).step(0.0001)
gui.add(material, 'thickness').min(0).max(1).step(0.0001)

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


const sphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere1.position.set(-1.5, 0, 0);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 128), material);
torus.position.set(1.5, 0, 0);


scene.add(sphere1, torus, plane);

// Ambient Light (soft overall light)
// const ambient = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambient);

// Point Light
// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.dampingFactor = 0.05;

//animation loop

const clock = new THREE.Clock()

function animate() {

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere1.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere1.rotation.x = -0.15 * elapsedTime
    plane.rotation.x = -0.15 * elapsedTime
    torus.rotation.x = -0.15 * elapsedTime

    renderer.render(scene, camera);
}

//handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});