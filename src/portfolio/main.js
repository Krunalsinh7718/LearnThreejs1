import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GUI } from "lil-gui";
import { Timer } from "../common/Timer.js"

//gui setup
const gui = new GUI();

const parameters = {
  materialColor: '#ffeded'
}

gui.addColor(parameters, 'materialColor').onChange(() => {
  material.color.set(parameters.materialColor)
})

// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('./assets/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

//scene setup
const scene = new THREE.Scene();

/**
 * Objects
 */

// Material
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture
})

// Meshes
const objectsDistance = 6
const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  material
)
const mesh2 = new THREE.Mesh(
  new THREE.ConeGeometry(1, 2, 32),
  material
)
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
)

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]
/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

//camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 6);
scene.add(camera);

//renderer setup
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.domElement.classList.add('webgl');
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setAnimationLoop(animation)

//animation
const timer = new Timer();

function animation() {
  //timer
  timer.update();
  const elapsedTime = timer.getElapsed();
  // Animate camera
  camera.position.y = -scrollY / window.innerHeight * objectsDistance;

  const parallaxX = cursor.x
  const parallaxY = -cursor.y
  camera.position.x = parallaxX
  camera.position.y = parallaxY

  // Animate meshes
  for (const mesh of sectionMeshes) {
    mesh.rotation.x = elapsedTime * 0.1
    mesh.rotation.y = elapsedTime * 0.12
  }

  //render
  renderer.render(scene, camera);
  requestAnimationFrame(animation)
}
/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / window.innerWidth - 0.5
  cursor.y = event.clientY / window.innerHeight - 0.5

  console.log(cursor)
})

/**
 * Scroll
 */
let scrollY = window.scrollY
window.addEventListener('scroll', () => {
  scrollY = window.scrollY

  // console.log(scrollY)
})

/**
 * resize
 */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})