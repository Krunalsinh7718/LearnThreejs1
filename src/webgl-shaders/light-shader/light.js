import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui';
import vertexShader from "./vertex.vert";
import fragmentShader from "./fragment.frag";

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

/**
 * Material
 */
const materialParameters = {};
materialParameters.color = '#fff';

gui.addColor(materialParameters, 'color').name("material color").onChange( e => {
    material.uniforms.uColor.value.set(materialParameters.color);
})


const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms:
        {
            uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
        }
});

/**
 * Models
 */
let LeePerrySmith = null; 
gltfLoader.load(
    '/models/LeePerrySmith/LeePerrySmith.glb',
    (gltf) => {
        // Model
        LeePerrySmith = gltf.scene.children[0];
       
        if(LeePerrySmith.isMesh){
            LeePerrySmith.material = material
        }
        LeePerrySmith.scale.set(0.4, 0.4, 0.4);
        LeePerrySmith.rotation.y = Math.PI * 0.5;
        scene.add(LeePerrySmith)
    }
)

// Torus knot
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
    material
)
torusKnot.position.x = 3
scene.add(torusKnot)

// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(),
    material
)
sphere.position.x = - 3
scene.add(sphere)

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

//light helper

//directional light helper
const directionalLightHelper = new THREE.Mesh(
    new THREE.PlaneGeometry(),
    new THREE.MeshBasicMaterial()
)
directionalLightHelper.material.color.setRGB(0.1, 0.1, 1.0);
directionalLightHelper.material.side = THREE.DoubleSide;
directionalLightHelper.position.set(0.0, 0.0, 3.0);
scene.add(directionalLightHelper);

//point light helper
const pointLightHelper = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial()
)
pointLightHelper.material.color.setRGB(1, 0.1, 0.1);
pointLightHelper.position.set(0,2.5,0);
scene.add(pointLightHelper);


const pointLightHelper2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial()
)
pointLightHelper2.material.color.setRGB(0.1,1.0,0.5);
pointLightHelper2.position.set(0.0, -2.5, -2.0);
scene.add(pointLightHelper2);


//renderer setup
const rendererParameters = {}
rendererParameters.clearColor = '#000'

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(rendererParameters.clearColor)
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

gui
    .addColor(rendererParameters, 'clearColor')
    .onChange(() =>
    {
        renderer.setClearColor(rendererParameters.clearColor)
    })

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();
//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();


    // Rotate objects
    if(LeePerrySmith)
    {
        LeePerrySmith.rotation.x = - elapsedTime * 0.1
        LeePerrySmith.rotation.y = elapsedTime * 0.2
    }

    sphere.rotation.x = - elapsedTime * 0.1
    sphere.rotation.y = elapsedTime * 0.2

    torusKnot.rotation.x = - elapsedTime * 0.1
    torusKnot.rotation.y = elapsedTime * 0.2


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

