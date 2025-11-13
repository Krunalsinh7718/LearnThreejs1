import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Timer } from "../common/Timer.js"


//scene setup
const scene = new THREE.Scene();

//mesh
const geometry = new THREE.BufferGeometry();

const pointsData = {
  counts : 10000
}

const positions = new Float32Array(pointsData.counts * 3);
function setPointsGeoAttribute(){
  for (let i = 0; i < pointsData.counts; i++) {
    const i3 = i * 3;
    positions[i3] = Math.random();
    positions[i3 + 1] = Math.random();
    positions[i3 + 2] = Math.random();
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
}

const material = new THREE.PointsMaterial({
  color: "red",
  size: 0.1
})
const points = new THREE.Points(geometry,material);
scene.add(points)

//lights
const ambientLight = new THREE.AmbientLight("red", 1);
scene.add(ambientLight)

//camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5,5,5);
scene.add(camera);

//renderer setup
const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation)
console.log(renderer);

//controls
const controls = new OrbitControls(camera, renderer.domElement)

//animation
const timer = new Timer();
console.log(timer);

function animation(){
  //timer
  timer.update();
  const elapsedTime = timer.getElapsed();
  // console.log(elapsedTime);
  
  

  //render
  renderer.render(scene, camera);

  requestAnimationFrame(animation)
}


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight);
  
})