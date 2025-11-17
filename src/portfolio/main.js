import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//scene setup
const scene = new THREE.Scene();

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,1));
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

//camera setup
const camera = new THREE.PerspectiveCamera(35, sizes.width/ sizes.height, 0.1, 1000);
camera.position.set(2,2,2);
camera.lookAt(0, 0, 0);
scene.add(camera);

//controls 
const control = new OrbitControls(camera, renderer.domElement);
scene.add(control)

//mesh
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshBasicMaterial({color: "red"})
)
scene.add(mesh)



//animation loop setup
function animation(){
  control.update();
  renderer.render(scene, camera)
}

//events
window.addEventListener('resize', e => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  renderer.setSize(sizes.width, sizes.height);
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1));

})