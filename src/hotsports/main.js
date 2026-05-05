import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GUI } from "lil-gui";
import { Timer } from "../common/Timer.js";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { gsap } from "gsap";

//gui setup
const gui = new GUI();

//scene setup
const scene = new THREE.Scene();


// LIGHT
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light);


// ROOM
const room = new THREE.Mesh(
  new THREE.BoxGeometry(10, 5, 10),
  new THREE.MeshStandardMaterial({
    color: 0x444444,
    side: THREE.BackSide
  })
);
scene.add(room);
//camera setup
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 2, 8);
scene.add(camera);

//renderer setup
const renderer = new THREE.WebGLRenderer({
  antialias: true
});
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation)

//controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;


// LABEL RENDERER
const labelRenderer = new CSS2DRenderer();

labelRenderer.setSize(
  window.innerWidth,
  window.innerHeight
);

labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';

document.body.appendChild(labelRenderer.domElement);

// HOTSPOTS
createHotspot({
  position: new THREE.Vector3(-3, 1, 0),

  label: 'Living Room',

  cameraPosition: new THREE.Vector3(
    -5,
    2,
    0
  ),

  target: new THREE.Vector3(
    -3,
    1,
    0
  )
});

createHotspot({
  position: new THREE.Vector3(3, 1, 0),

  label: 'Kitchen',

  cameraPosition: new THREE.Vector3(
    5,
    2,
    0
  ),

  target: new THREE.Vector3(
    3,
    1,
    0
  )
});

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

  labelRenderer.render(scene, camera);
}


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight);

})


// -----------------------------------
// HOTSPOT FUNCTION
// -----------------------------------

function createHotspot({
  position,
  label,
  cameraPosition,
  target
}) {

  // HTML
  const wrapper = document.createElement('div');
  wrapper.className = 'hotspot-wrapper';

  const button = document.createElement('div');
  button.className = 'hotspot';
  button.innerHTML = '+';

  const text = document.createElement('div');
  text.className = 'label';
  text.textContent = label;

  wrapper.appendChild(button);
  wrapper.appendChild(text);

  // Enable clicks
  button.style.pointerEvents = 'auto';

  // CSS2D Object
  const hotspot = new CSS2DObject(wrapper);

  hotspot.position.copy(position);

  // CLICK EVENT
  button.addEventListener('click', () => {

    controls.enabled = false;

    gsap.to(camera.position, {
      duration: 2,
      x: cameraPosition.x,
      y: cameraPosition.y,
      z: cameraPosition.z,

      ease: 'power2.inOut',

      onUpdate: () => {
        controls.update();
      }
    });

    gsap.to(controls.target, {
      duration: 2,
      x: target.x,
      y: target.y,
      z: target.z,

      ease: 'power2.inOut',

      onUpdate: () => {
        controls.update();
      },

      onComplete: () => {
        controls.enabled = true;
      }
    });

  });

  scene.add(hotspot);
}
