import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://unpkg.com/three@0.169.0/examples/jsm/loaders/MTLLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { gsap } from "gsap";


//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10); // Move the camera up and back
camera.lookAt(0, 0, 0);


const camParams = { angle: 0 }; // an object with a numeric property

// gsap.to(camera.position, {
//   duration: 4,
//   x: 5,
//   y: 3,
//   z: 5,
//   ease: "power2.inOut",
//   onUpdate: () => camera.lookAt(0, 0, 0),
//   yoyo: true,
//   repeat: -1
// });

// gsap.to(camParams, {
//     angle: Math.PI * 2,
//     duration: 6,
//     repeat: -1,
//     ease: "none",
//     onUpdate: () => {
//         const radius = 5;
//         camera.position.x = Math.sin(camParams.angle) * radius;
//         camera.position.z = Math.cos(camParams.angle) * radius;
//         camera.position.y = Math.sin(camParams.angle * 0.5) * 1.5;
//         camera.lookAt(0, 0, 0);
//     }
// });

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // optional, softer edges
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//mesh setup
// ✅ Load the model
// const loader = new GLTFLoader();
// let model;
// loader.load(
//     './assets/table/wooden_table_02_4k.gltf', // Path to your model
//     (gltf) => {
//         model = gltf.scene;
//         model.scale.set(1, 1, 1);
//         model.position.set(0, -0.8, 0);

//         model.traverse((child) => {
//             if (child.isMesh) {
//                 child.castShadow = true;    // model casts shadow
//                 child.receiveShadow = true; // optional: receives too
//             }
//         });
//         scene.add(model);
//     },
//     (xhr) => {
//         console.log(`Loading: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
//     },
//     (error) => {
//         console.error('An error occurred:', error);
//     }
// );


// const loader1 = new OBJLoader();
// let model1;
//  loader1.load(
//         'assets/bugatti/bugatti.obj', // <-- path to your OBJ file
//         (object) => {
//           object.scale.set(0.5, 0.5, 0.5);
//           scene.add(object);
//         },
//         (xhr) => {
//           console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//         },
//         (error) => {
//           console.error('An error occurred:', error);
//         }
//       );

const mtlLoader = new MTLLoader();
mtlLoader.load('./assets/car2/Low-Poly-Racing-Car.mtl', (materials) => {
  materials.preload();
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load('./assets/car2/Low-Poly-Racing-Car.obj', (object) => {
    object.scale.set(0.005, 0.005, 0.005); 
    object.position.set(0, -0.8, 0);

     object.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(object)
});
});



// const loader = new FBXLoader();
// loader.load(
//   './assets/car2/Low-Poly-Racing-Car.fbx', 
//   (object) => {
//     object.scale.set(0.005, 0.005, 0.005);  
//     object.position.set(0, -0.8, 0);
//     object.traverse((child) => {
//       if (child.isMesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;
//       }
//     });
//     scene.add(object);
//   },
//   (xhr) => {
//     console.log(`Loading: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
//   },
//   (error) => {
//     console.error('Error loading FBX model:', error);
//   }
// );


{
    const geometry = new THREE.PlaneGeometry(10, 4);
    const material = new THREE.MeshStandardMaterial({ color: "#666", side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -0.8;
    scene.add(mesh);
}

// Ambient Light (soft overall light)
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

// Directional Light (like sunlight)
const light2 = new THREE.DirectionalLight(0xffffff, 10);
light2.castShadow = true;
light2.shadow.mapSize.width = 2048;
light2.shadow.mapSize.height = 2048;
light2.position.set(5, 5, 5);

light2.shadow.camera.near = 1;
light2.shadow.camera.far = 50;
light2.shadow.camera.left = -10;
light2.shadow.camera.right = 10;
light2.shadow.camera.top = 10;
light2.shadow.camera.bottom = -10;
scene.add(light2);

const helper2 = new THREE.DirectionalLightHelper(light2, 1);
scene.add(helper2);


//point light
// const light = new THREE.PointLight(0xffffff, 1);
// light.position.set(10, 10, 10);
// scene.add(light);

// const light = new THREE.SpotLight(0xffffff, 200);
// light.position.set(5, 5, 5);
// light.angle = Math.PI / 8;
// light.penumbra = 0.2;
// light.decay = 1;
// light.distance = 15;
// light.castShadow = true;
// light.shadow.mapSize.width = 2048;
// light.shadow.mapSize.height = 2048;
// light.shadow.camera.near = 1;
// light.shadow.camera.far = 50;
// scene.add(light);

// const helper = new THREE.SpotLightHelper(light);
// scene.add(helper);

const light = new THREE.PointLight(0xffffff, 100, 50);
light.position.set(5, 5, 5);
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 1;
light.shadow.camera.far = 50;
scene.add(light);

const helper = new THREE.PointLightHelper(light, 0.5);
scene.add(helper);

const light1 = new THREE.HemisphereLight("blue", "red", 1);
scene.add(light1);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.dampingFactor = 0.05;

//animation loop
function animate() {
    const time = Date.now() * 0.001;

    light.position.set(Math.sin(time) * 5, 5, Math.cos(time) * 5);

    helper.update();

    light2.position.set(Math.sin(-time) * 5, 5, Math.cos(-time) * 5);

    helper2.update();

    controls.update();

    renderer.render(scene, camera);
}

//handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});