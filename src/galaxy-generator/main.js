import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GUI } from "lil-gui";
import { Timer } from "../common/Timer.js"

//gui setup
const gui = new GUI();

//scene setup
const scene = new THREE.Scene();

//mesh

const pointsData = {
  count: 10000,
  size: 0.02,
  radius : 5,
  branches : 3,
  spin : 1,
  randomness: 0.2,
  randomnessPower : 3,
  insideColor: "#ff6030",
  outsideColor: "#1b3984",
}

gui.add(pointsData, 'count').min(100).max(100000).step(1).onFinishChange(generateGalaxy)
gui.add(pointsData, 'size').min(0.01).max(1).step(0.001).onFinishChange(generateGalaxy);
gui.add(pointsData, 'radius').min(1).max(10).step(0.1).onFinishChange(generateGalaxy);
gui.add(pointsData, 'spin').min(1).max(5).step(0.1).onFinishChange(generateGalaxy);
gui.add(pointsData, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(pointsData, 'randomnessPower').min(1).max(10).step(0.01).onFinishChange(generateGalaxy)
gui.addColor(pointsData, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(pointsData, 'outsideColor').onFinishChange(generateGalaxy)

let geometry = null;
let material = null;
let points = null;

function generateGalaxy() {
  
  
  // Destroy old galaxy
  if (points !== null) {
    console.log(points);
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }

  /* 
  * Geometry
  */
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(pointsData.count * 3);
  const colors = new Float32Array(pointsData.count * 3)

  /* 
  * material
  */
  material = new THREE.PointsMaterial({
    size: pointsData.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  })


  for (let i = 0; i < pointsData.count; i++) {
    const i3 = i * 3;

    const radius = Math.random() * pointsData.radius;
    const branchAngle = (i % pointsData.branches) / pointsData.branches * Math.PI * 2
    const spinAngle = radius * pointsData.spin

    const colorInside = new THREE.Color(pointsData.insideColor)
    const colorOutside = new THREE.Color(pointsData.outsideColor)
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / pointsData.radius)

    const randomnessX = Math.pow(Math.random() , pointsData.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * pointsData.randomness * radius;
    const randomnessY = Math.pow(Math.random() , pointsData.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * pointsData.randomness * radius;
    const randomnessZ = Math.pow(Math.random() , pointsData.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * pointsData.randomness * radius;

    colors[i3    ] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomnessX;
    positions[i3 + 1] = randomnessY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomnessZ;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  /**
   * Points
   */
  points = new THREE.Points(geometry, material);
  scene.add(points)
}
generateGalaxy();


//lights
const ambientLight = new THREE.AmbientLight("red", 1);
scene.add(ambientLight)

//camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);
scene.add(camera);

//renderer setup
const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation)

//controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

//animation
const timer = new Timer();

function animation() {
  //timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  controls.update();

  //render
  renderer.render(scene, camera);
  requestAnimationFrame(animation)
}


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight);

})