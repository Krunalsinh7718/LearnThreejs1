import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from "lil-gui";
import gsap from 'gsap';

//gui
const gui = new GUI();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//texture loader
const textureLoader = new THREE.TextureLoader();
const texture1 = textureLoader.load("./assets/gradients/3.jpg");
texture1.magFilter = THREE.NearestFilter;

//scene setup
const scene = new THREE.Scene();

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.domElement.classList.add('webgl');
renderer.setClearAlpha(0);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

//camera setup
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 6
cameraGroup.add(camera);


/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

//mesh
const parameters = {
  materialColor: "red",
}
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: texture1
})

const objectsDistance = 4

const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  material
)
mesh1.scale.set(0.5, 0.5, 0.5)

const mesh2 = new THREE.Mesh(
  new THREE.ConeGeometry(1, 2, 32),
  material
)
// mesh2.visible = false;

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
)
mesh3.scale.set(0.5, 0.5, 0.5)


mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

gui.addColor(parameters, 'materialColor').onChange(() => {
  material.color.set(parameters.materialColor)
  pointsMaterial.color.set(parameters.materialColor)
})


//particles
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10
  positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const pointsMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.02
})
const particlesMesh = new THREE.Points(particleGeometry, pointsMaterial);
scene.add(particlesMesh)


//animation loop setup
const clock = new THREE.Clock();
let previousTime = 0

function animation() {

  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  camera.position.y = -scrollY / sizes.height * objectsDistance
  const parallaxX = cursor.x * 0.5
  const parallaxY = -cursor.y * 0.5
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1
    mesh.rotation.y += deltaTime * 0.12
  }
  renderer.render(scene, camera)
}

/* 
 * Events 
 */

//mousemove
const cursor = {
  x: 0,
  y: 0
}
window.addEventListener("mousemove", e => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
})

//scroll
let scrollY = window.screenY;
let currentSection = 0;

window.addEventListener('scroll', e => {
  scrollY = window.scrollY
   const newSection = Math.round(scrollY / sizes.height);

   if(currentSection != newSection){
    currentSection = newSection;
    // console.log('changed', currentSection)
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

//resize
window.addEventListener('resize', e => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  renderer.setSize(sizes.width, sizes.height);
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));

})