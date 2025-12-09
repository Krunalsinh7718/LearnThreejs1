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
scene.environmentIntensity = 0

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child.isMesh)
        {
             child.castShadow = true
            child.receiveShadow = true
        }
    })
}

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

hdrLoader.load('/images/environment-maps/1/2k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = environmentMap
    scene.environment = environmentMap
})

/*=============================================
=            models            =
=============================================*/
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  // '/models/FlightHelmet/glTF/FlightHelmet.gltf',
  '/models/burger/burger1.glb',
  (gltf) => {
    gltf.scene.scale.set(0.4, 0.4, 0.4);
    gltf.scene.position.set(0, 2.5, 0)
    scene.add(gltf.scene)

     updateAllMaterials()
  }
)


/**
 * Floor
 */
const floorColorTexture = textureLoader.load('/images/haunted-house/wall/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg');
floorColorTexture.colorSpace = THREE.SRGBColorSpace;
const floorNormalTexture = textureLoader.load('/images/haunted-house/wall/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png')
const floorAORoughnessMetalnessTexture = textureLoader.load('/images/haunted-house/wall/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg')

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({
        map: floorColorTexture,
        normalMap: floorNormalTexture,
        aoMap: floorAORoughnessMetalnessTexture,
        roughnessMap: floorAORoughnessMetalnessTexture,
        metalnessMap: floorAORoughnessMetalnessTexture,
    })
)
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)


/**
 * wall
 */
const wallColorTexture = textureLoader.load('/images/haunted-house/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg');
wallColorTexture.colorSpace = THREE.SRGBColorSpace;
const wallNormalTexture = textureLoader.load('/images/haunted-house/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg')
const wallAORoughnessMetalnessTexture = textureLoader.load('/images/haunted-house/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg')

const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        normalMap: wallNormalTexture,
        aoMap: wallAORoughnessMetalnessTexture,
        roughnessMap: wallAORoughnessMetalnessTexture,
        metalnessMap: wallAORoughnessMetalnessTexture,
    })
)
wall.position.y = 4
wall.position.z = - 4
scene.add(wall)

//camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 14); // Move the camera up and back
camera.lookAt(0, 0, 0);

/**
 * Directional light
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 6)
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.027
directionalLight.shadow.bias = - 0.004
directionalLight.shadow.mapSize.set(512, 512);
directionalLight.position.set(-4, 6.5, 2.5)
scene.add(directionalLight)
gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(- 10).max(10).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(- 10).max(10).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(- 10).max(10).step(0.001).name('lightZ')

gui.add(directionalLight.shadow, 'normalBias').min(- 0.05).max(0.05).step(0.001)
gui.add(directionalLight.shadow, 'bias').min(- 0.05).max(0.05).step(0.001)

//shadows
directionalLight.castShadow = true;
gui.add(directionalLight, "castShadow")

//helper
const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightHelper);

//target
directionalLight.target.position.set(0, 4, 0)
directionalLight.target.updateMatrixWorld();

//renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//tone mapping
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)
gui.add(renderer, "toneMapping", {
   No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping
})

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.dampingFactor = 0.05;




//animation loop
const clock = new THREE.Clock()

function animate() {

  const elapsedTime = clock.getElapsedTime();

  renderer.render(scene, camera);
}

//handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});