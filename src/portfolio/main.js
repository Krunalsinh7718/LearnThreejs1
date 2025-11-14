import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GUI } from "lil-gui";
import { Timer } from "../common/Timer.js"
import { gsap } from "gsap";

//gui setup
const gui = new GUI();

const parameters = {
  materialColor: '#ffeded'
}

gui.addColor(parameters, 'materialColor').onChange(() => {
   material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
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
 * Particles
 */
// Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearAlpha(0);
renderer.domElement.classList.add('webgl');
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setAnimationLoop(animation)

//animation
const clock = new THREE.Clock()
let previousTime = 0

function animation() {
  //timer
  const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
  // Animate camera
  camera.position.y = -scrollY / window.innerHeight * objectsDistance;

  const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

  // Animate meshes
  for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

  //render
  renderer.render(scene, camera);
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

  // console.log(cursor)
})

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0
window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / window.innerHeight)

      if(newSection != currentSection)
    {
        // ...

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                 x: '+=6',
                y: '+=3',
                z: '+=1.5'
            }
        )
    }
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