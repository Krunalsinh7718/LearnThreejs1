import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from "gsap";
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GroundedSkybox } from 'three/examples/jsm/Addons.js';

import GUI from 'lil-gui';

// GUI setup
const gui = new GUI();

//scene setup
const scene = new THREE.Scene();
scene.environmentIntensity = 3
scene.backgroundBlurriness = 0
scene.backgroundIntensity = 1
scene.backgroundRotation.x = 0
scene.environmentRotation.x = Math.PI

gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.001)
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001)
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001)
gui.add(scene.backgroundRotation, 'y').min(0).max(Math.PI * 2).step(0.001).name('backgroundRotationY')
gui.add(scene.environmentRotation, 'y').min(0).max(Math.PI * 2).step(0.001).name('environmentRotationY')

//loaders
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

const hdrLoader = new HDRLoader()
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

/*=============================================
=            environment maps            =
=============================================*/

// hdrLoader.load('/images/environment-maps/6/blender-2k.hdr', (environmentMap) =>
// {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping;

//     scene.background = environmentMap
//     scene.environment = environmentMap
// })

// hdrLoader.load('/images/environment-maps/2/2k.hdr', (environmentMap) =>
// {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping;

//     scene.environment = environmentMap

//     //skybox 
//     const skybox = new GroundedSkybox(environmentMap, 15, 70);
//     // skybox.material.wireframe = true;
//     skybox.position.y = 15;
//     scene.add(skybox);  
// })

// const envMap = textureLoader.load('/images/environment-maps/blockadesLabsSkybox/anime_art_style_japan_streets_with_cherry_blossom_.jpg')
// envMap.mapping = THREE.EquirectangularReflectionMapping;
// envMap.colorSpace = THREE.SRGBColorSpace;

// scene.background = envMap;
// scene.environment = envMap;

// const environmentMap = cubeTextureLoader.load([
//   "/images/environment-maps/2/px.png",
//   "/images/environment-maps/2/nx.png",
//   "/images/environment-maps/2/py.png",
//   "/images/environment-maps/2/ny.png",
//   "/images/environment-maps/2/pz.png",
//   "/images/environment-maps/2/nz.png",
// ]);
// scene.background = environmentMap
// scene.environment = environmentMap

/*=============================================
=            real time environment maps            =
=============================================*/
const envMap = textureLoader.load('/images/environment-maps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg');
envMap.mapping = THREE.EquirectangularReflectionMapping;
envMap.colorSpace = THREE.SRGBColorSpace;

scene.background = envMap;

//holy donut
const holyDonut = new THREE.Mesh(
  new THREE.TorusGeometry(8, 0.5),
  new THREE.MeshBasicMaterial({color: new THREE.Color(10, 4 , 2) })
);
holyDonut.position.set(0, 3.5, 0);
holyDonut.layers.enable(1);
scene.add(holyDonut);

//cube render target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  type : THREE.HalfFloatType,
});
scene.environment = cubeRenderTarget.texture

//cube camera
const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
cubeCamera.layers.set(1);

/*=============================================
=            models            =
=============================================*/

const gltfLoader = new GLTFLoader();
gltfLoader.load(
  '/models/FlightHelmet/glTF/FlightHelmet.gltf',
  (gltf) => {
    gltf.scene.scale.set(10, 10, 10)
    scene.add(gltf.scene)
  }
)

//meshes
const shape1 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.4, 0.15, 100, 16),
  new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0, color: 0xaaaaaa })
);
shape1.position.x = - 6
shape1.position.y = 4
shape1.scale.set(3, 3, 3)
scene.add(shape1);




//camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 14); // Move the camera up and back
camera.lookAt(0, 0, 0);

//renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);





//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.dampingFactor = 0.05;

//animation loop

const clock = new THREE.Clock()

function animate() {

  const elapsedTime = clock.getElapsedTime();

  //realtime env map
  if(holyDonut){
    holyDonut.rotation.x = Math.sin(elapsedTime ) * 2;
    cubeCamera.update(renderer, scene);
  }

  // scene.backgroundRotation.y = elapsedTime * 0.1
  // scene.environmentRotation.y = elapsedTime * 0.1

  renderer.render(scene, camera);
}

//handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});