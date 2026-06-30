import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from "gsap";
import GUI from "lil-gui";


import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'



/*=============================================
=            GUI setup            =
=============================================*/
const gui = new GUI();

//loader
const textureLoader = new THREE.TextureLoader();

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(13.6, 0.30, 20); // Move the camera up and back
// camera.lookAt(0, 0, 0);
gui.add(camera.position, 'x').min(-20).max(20).step(0.1).name("camera x");
gui.add(camera.position, 'y').min(-20).max(20).step(0.1).name("camera y");
gui.add(camera.position, 'z').min(-20).max(20).step(0.1).name("camera z");

//skybox
textureLoader.load(
    '/images/environment-maps/woolen-world/woolen-world.png',
    (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.mapping =
            THREE.EquirectangularReflectionMapping;

        scene.background = texture;
        scene.environment = texture;
    }
);

/*=============================================
=            Models            =
=============================================*/
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/loaders/draco/')
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader)
// let mixer = null
let woolenWorldModel = null;
gltfLoader.load("/models/woolen/woolen-world-2.glb",
  (gltf) => {
    woolenWorldModel = gltf.scene;
    // console.log(gltf);
    woolenWorldModel.scale.set(0.25, 0.25, 0.25)
     woolenWorldModel.rotation.x = 0.0800;
        woolenWorldModel.rotation.y = -0.98;
    // mixer = new THREE.AnimationMixer(woolenWorldModel)
    // const action = mixer.clipAction(gltf.animations[2])
    // action.play()
    scene.add(woolenWorldModel)


    gui.add(woolenWorldModel.rotation, 'x').min(-6.28).max(6.28).step(0.1);
    gui.add(woolenWorldModel.rotation, 'y').min(-6.28).max(6.28).step(0.1);
    gui.add(woolenWorldModel.rotation, 'z').min(-6.28).max(6.28).step(0.1);
  },
  (progress) => {
    console.log('progress')
    console.log(progress)
  },
  (error) => {
    console.log('error')
    console.log(error)
  }
)


//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Ambient Light (soft overall light)
const ambient = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambient);

// Directional Light (like sunlight)
const dirLight = new THREE.DirectionalLight(0xffffff, 4);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

//point light
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

// Light helper (to visualize the light)
const helper = new THREE.DirectionalLightHelper(dirLight, 1);
// scene.add(helper);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.dampingFactor = 0.05;

//animation loop
function animate() {
    if(woolenWorldModel){
        woolenWorldModel.rotation.z -= 0.002;
        
    }
    controls.update();

    renderer.render(scene, camera);
}

//handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});