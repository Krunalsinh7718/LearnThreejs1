import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import testVertexShader from './vertex.vert'
import testFragmentShader from './fragment.frag'
import GUI from 'lil-gui'

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

/**
 * Models
 */

gltfLoader.load(
    '/models/coffiee-with-table/bakedModel.glb',
    (gltf) => {
        gltf.scene.getObjectByName('baked').material.map.anisotropy = 8;
        scene.add(gltf.scene)
    }
)

/**
 * Smaoke
 */
//geomatry
const smokeGeomatry = new THREE.PlaneGeometry(1, 1, 16, 64);
smokeGeomatry.translate(0, 0.5, 0);
smokeGeomatry.scale(1.5, 6, 1.5);

//perline texture
const perlinTexture = textureLoader.load('/images/coffiee-smoke/perlin.png');
perlinTexture.wrapS = THREE.RepeatWrapping;
perlinTexture.wrapT = THREE.RepeatWrapping;
//material
const smokeMaterial = new THREE.ShaderMaterial({
    // color: "cyan",
    // wireframe: true,
    transparent: true,
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,
    depthWrite: false,
    uniforms: {
        uperlinTexture: new THREE.Uniform(perlinTexture),
        uTime: new THREE.Uniform(0)
    }
})

//mesh
const smoke = new THREE.Mesh(smokeGeomatry, smokeMaterial);
smoke.position.y = 1.83;
scene.add(smoke);



//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 8
camera.position.y = 10
camera.position.z = 12
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true});

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

    smokeMaterial.uniforms.uTime.value = elapsedTime;

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

