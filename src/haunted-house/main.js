import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from "gsap";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/Addons.js';
// import GUI from 'lil-gui';
import { Sky } from 'three/addons/objects/Sky.js'
import { Timer } from '../common/Timer.js';
import { textureRepeat } from "../common/utilityFunctions.js";

// GUI setup
// const gui = new GUI();

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(4, 2, 5); // Move the camera up and back
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

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
// Floor
const floorAlphaTexture = textureLoader.load('./assets/floor/alpha.webp')
// const floorColorTexture = textureLoader.load('./assets/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp')
// const floorARMTexture = textureLoader.load('./assets/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp')
// const floorNormalTexture = textureLoader.load('./assets/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp')
// const floorDisplacementTexture = textureLoader.load('./assets/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp')

const floorColorTexture = textureLoader.load('./assets/floor/aerial_rocks_04_1k/aerial_rocks_04_diff_1k.webp')
const floorARMTexture = textureLoader.load('./assets/floor/aerial_rocks_04_1k/aerial_rocks_04_arm_1k.webp')
const floorNormalTexture = textureLoader.load('./assets/floor/aerial_rocks_04_1k/aerial_rocks_04_nor_gl_1k.webp')
const floorDisplacementTexture = textureLoader.load('./assets/floor/aerial_rocks_04_1k/aerial_rocks_04_disp_1k.webp')

// Wall
// const wallColorTexture = textureLoader.load('./assets/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp')
// const wallARMTexture = textureLoader.load('./assets/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp')
// const wallNormalTexture = textureLoader.load('./assets/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp')

const wallColorTexture = textureLoader.load('./assets/wall/rock_wall_15_1k/rock_wall_15_diff_1k.webp')
const wallARMTexture = textureLoader.load('./assets/wall/rock_wall_15_1k/rock_wall_15_arm_1k.webp')
const wallNormalTexture = textureLoader.load('./assets/wall/rock_wall_15_1k/rock_wall_15_nor_gl_1k.webp')

// Roof
const roofColorTexture = textureLoader.load('./assets/roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp')
const roofARMTexture = textureLoader.load('./assets/roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp')
const roofNormalTexture = textureLoader.load('./assets/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp')

// Bush
const bushColorTexture = textureLoader.load('./assets/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp')
const bushARMTexture = textureLoader.load('./assets/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp')
const bushNormalTexture = textureLoader.load('./assets/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp')

// Grave
const graveColorTexture = textureLoader.load('./assets/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp')
const graveARMTexture = textureLoader.load('./assets/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp')
const graveNormalTexture = textureLoader.load('./assets/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp')

// Door
const doorColorTexture = textureLoader.load('./assets/door/color.webp')
const doorAlphaTexture = textureLoader.load('./assets/door/alpha.webp')
const doorAmbientOcclusionTexture = textureLoader.load('./assets/door/ambientOcclusion.webp')
const doorHeightTexture = textureLoader.load('./assets/door/height.webp')
const doorNormalTexture = textureLoader.load('./assets/door/normal.webp')
const doorMetalnessTexture = textureLoader.load('./assets/door/metalness.webp')
const doorRoughnessTexture = textureLoader.load('./assets/door/roughness.webp')

const textures = [
  { texture: floorColorTexture, repeatCount: { x: 8, y: 8 } },
  { texture: floorARMTexture, repeatCount: { x: 8, y: 8 } },
  { texture: floorNormalTexture, repeatCount: { x: 8, y: 8 } },
  { texture: floorDisplacementTexture, repeatCount: { x: 8, y: 8 } },
  { texture: roofColorTexture, repeatCount: { x: 3, y: 3 }, wrapT: false },
  { texture: roofARMTexture, repeatCount: { x: 3, y: 1 }, wrapT: false },
  { texture: roofNormalTexture, repeatCount: { x: 3, y: 1 }, wrapT: false },
  { texture: bushColorTexture, repeatCount: { x: 2, y: 1 }, wrapT: false },
  { texture: bushARMTexture, repeatCount: { x: 2, y: 1 }, wrapT: false },
  { texture: bushNormalTexture, repeatCount: { x: 2, y: 1 }, wrapT: false },
  { texture: graveColorTexture, repeatCount: { x: 0.3, y: 0.4 }, wrapT: false },
  { texture: graveARMTexture, repeatCount: { x: 0.3, y: 0.4 }, wrapT: false },
  { texture: graveNormalTexture, repeatCount: { x: 0.3, y: 0.4 }, wrapT: false },

];
textures.forEach(texture => textureRepeat(texture.texture, texture.repeatCount.x, texture.repeatCount.y, texture.wrapT))

floorColorTexture.colorSpace = THREE.SRGBColorSpace;
wallColorTexture.colorSpace = THREE.SRGBColorSpace;
roofColorTexture.colorSpace = THREE.SRGBColorSpace;
bushColorTexture.colorSpace = THREE.SRGBColorSpace;
graveColorTexture.colorSpace = THREE.SRGBColorSpace
doorColorTexture.colorSpace = THREE.SRGBColorSpace
/**
 * House
 */

// House container
const house = new THREE.Group()
scene.add(house)

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: floorAlphaTexture,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: - 0.2
  })
)
floor.rotation.x = - Math.PI * 0.5;
floor.receiveShadow = true;
house.add(floor)

// gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floorDisplacementScale')
// gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('floorDisplacementBias')

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture
  })
)
walls.position.y = 1.25;
walls.receiveShadow = true;
walls.castShadow = true;
house.add(walls)

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture
  })
)
roof.position.y = 2.5 + 0.75;
roof.rotation.y = Math.PI * 0.25;

house.add(roof)

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture
  })
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
  color: '#ccffcc',
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.rotation.x = - 0.75

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = - 0.75

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 0.8, 0.1, 2.2)
bush3.rotation.x = - 0.75

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(- 1, 0.05, 2.6)
bush4.rotation.x = - 0.75

house.add(bush1, bush2, bush3, bush4)

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture
})

const graves = new THREE.Group()
scene.add(graves)

for (let i = 0; i < 30; i++) {

  const angle = Math.random() * Math.PI * 2
  const radius = 3 + Math.random() * 4
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius

  // Mesh
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.position.x = x
  grave.position.y = Math.random() * 0.4
  grave.position.z = z

  grave.rotation.x = (Math.random() - 0.5) * 0.4
  grave.rotation.y = (Math.random() - 0.5) * 0.4
  grave.rotation.z = (Math.random() - 0.5) * 0.4

  // Add to the graves group
  graves.add(grave)
}


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)


/**
 * Ghosts
*/
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2, ghost3)

// Mappings
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = - 8
directionalLight.shadow.camera.left = - 8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Cast and receive
directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true

for(const grave of graves.children)
{
    grave.castShadow = true
    grave.receiveShadow = true
}

/**
 * Sky
 */
const sky = new Sky();
sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)
sky.scale.set(100, 100, 100)
scene.add(sky);

// gui.add(sky.material.uniforms.turbidity, 'value').min(0).max(20).step(0.5).name('sun turbidity');
// gui.add(sky.material.uniforms.rayleigh, 'value').min(0).max(6).step(0.1).name('sun rayleigh');
// gui.add(sky.material.uniforms.mieCoefficient, 'value').min(0).max(0.5).step(0.02).name('sun mieCoefficient');
// gui.add(sky.material.uniforms.mieDirectionalG, 'value').min(0).max(2).step(0.5).name('sun mieDirectionalG');
// gui.add(sky.material.uniforms.sunPosition.value, 'x').min(-2).max(2).step(0.05).name('sun sunPosition x');
// gui.add(sky.material.uniforms.sunPosition.value, 'y').min(-2).max(2).step(0.05).name('sun sunPosition y');
// gui.add(sky.material.uniforms.sunPosition.value, 'z').min(-2).max(2).step(0.05).name('sun sunPosition z');

/**
 * Fog
 */
scene.fog = new THREE.FogExp2('#04343f', 0.1);



/**
 * Animate
 */
const timer = new Timer();
function animate() {

  // Timer
  timer.update()
  const elapsedTime = timer.getElapsed();

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4
  ghost1.position.z = Math.sin(ghost1Angle) * 4
  ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)

  const ghost2Angle = elapsedTime * 0.5
  ghost2.position.x = Math.cos(ghost2Angle) * 4
  ghost2.position.z = Math.sin(ghost2Angle) * 4
  ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)

  const ghost3Angle = elapsedTime * 0.23
  ghost3.position.x = Math.cos(ghost3Angle) * 6
  ghost3.position.z = Math.sin(ghost3Angle) * 6
  ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);
}

//handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


