import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui';
import smokeVertexShader from "./vertex.vert";
import smokeFragmentShader from "./fragment.frag";

const gui = new GUI({ width: 350 });

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//scene setup
const scene = new THREE.Scene();

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

// Textures
const perlinNoise = textureLoader.load('/images/perlin-noise/perlin.png');
perlinNoise.wrapS = THREE.RepeatWrapping;
perlinNoise.wrapT = THREE.RepeatWrapping;
/**
 * Models
 */
gltfLoader.load(
    '/models/coffee-with-table/bakedModel.glb',
    (gltf) => {
        scene.add(gltf.scene)
    }
)

/**
 * Plane
 */
const geomatry = new THREE.PlaneGeometry(1, 1, 16, 64);
geomatry.translate(0, 0.5, 0);
geomatry.scale(1.5, 6,1);

const material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        vertexShader: smokeVertexShader,
        fragmentShader: smokeFragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
            uPerlinNoise : new THREE.Uniform(perlinNoise),
            uTime : new THREE.Uniform(0)
        }
    })

const plane = new THREE.Mesh(
    geomatry,
    material
)
// plane.rotation.y = Math.PI
plane.position.y = 1.825
// plane.position.z = 5
scene.add(plane)

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();
//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();

    material.uniforms.uTime.value = elapsedTime;

    //update controls
    controls.update();

    //render
    renderer.render(scene, camera);

}

//handle window resize
window.addEventListener('resize', () => {

    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

});

