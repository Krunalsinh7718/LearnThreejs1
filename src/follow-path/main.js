import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


/*=============================================
=            common variables            =
=============================================*/
const parameters = {
  canvasWidth: window.innerWidth,
  canvasHeight: window.innerHeight,
  speed: 0.002,
  gravity: 0.15,
  velocity: 0.004,
  minVelocity : 0.000,
  maxVelocity: 0.08,
  trainBoxGap : 4,
  // Math.max(0.005, Math.min(0.08, velocity));
}

/*=============================================
=            GUI setup            =
=============================================*/
const gui = new GUI();
gui.add(parameters, "speed").min(0).max(0.008).step(0.0001);
gui.add(parameters, "gravity").min(0).max(1).step(0.01);
gui.add(parameters, "velocity").min(0).max(0.05).step(0.0001);
gui.add(parameters, "trainBoxGap").min(3).max(8).step(1);


/*=============================================
=            Models            =
=============================================*/
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/loaders/draco/')
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader)




/*=============================================
=            Scene and world setup            =
=============================================*/
const scene = new THREE.Scene();

/*=============================================
=            Camera setup            =
=============================================*/
const camera = new THREE.PerspectiveCamera(75, parameters.canvasWidth / parameters.canvasHeight, 0.1, 100)
camera.position.set(-12, 4, 0)
scene.add(camera)

/*=============================================
=            renderer setup            =
=============================================*/
const renderer = new THREE.WebGLRenderer();
renderer.domElement.classList.add('webgl')
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(parameters.canvasWidth, parameters.canvasHeight)
renderer.setAnimationLoop(animation)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

/*=============================================
=            Controls setup            =
=============================================*/
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true


/*=============================================
=           platform          =
=============================================*/
const planeSize = 50;
const halfPlane = planeSize * 0.5;
const planeStart =  0 - halfPlane;
const planeEnd = halfPlane;
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(planeSize, planeSize),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide
  })
);
plane.position.y = -5;
plane.rotation.x = - Math.PI / 2;
scene.add(plane);


/*=============================================
=            path            =
=============================================*/
//Create a closed wavey loop
const edgeOffset = 10;
const curve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( planeStart + edgeOffset, 0, planeStart + edgeOffset),
	new THREE.Vector3( planeStart + edgeOffset, 10, 0),
	new THREE.Vector3( planeStart + edgeOffset, 0, planeEnd - edgeOffset),
	new THREE.Vector3( planeEnd - edgeOffset, 0, planeEnd - edgeOffset),
	new THREE.Vector3( planeEnd - edgeOffset, 0, planeStart + edgeOffset),
	
], true );
console.log(curve.getLength());

const points = curve.getPoints( 50 );
const geometry = new THREE.BufferGeometry().setFromPoints( points );
const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
// Create the final object to add to the scene
const curveObject = new THREE.Line( geometry, material );
scene.add(curveObject);

const boxCount = 5;
const boxes = [];
const boxGeometry = new THREE.BoxGeometry(1,1,3);
const boxMaterial = new THREE.MeshStandardMaterial({
  color: "blue"
})
for (let i = 0; i < boxCount; i++) {
  const box = new THREE.Mesh(
      boxGeometry,
      boxMaterial
  )
  boxes.push(box);
  scene.add(box);
}

const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

/*=============================================
=            lights            =
=============================================*/
const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)


/*=============================================
=            animation loop            =
=============================================*/
const clock = new THREE.Clock();
let progress = 0;



const curveLength = curve.getLength();

function wrap01(t) {
  return ((t % 1) + 1) % 1;
}

function animation() {
  
  const distBetweenBox = parameters.trainBoxGap / curveLength;
  //elapsed time
  const elapsedTime = clock.getElapsedTime();

  // const progress = (elapsedTime * 0.08) % 1;
  // console.log(progress);
  
  
  // const position = curve.getPointAt(progress) ;
  
  // box.position.copy(position);
  
  // const tangent = curve.getTangentAt(progress).normalize();
  // box.lookAt(position.clone().add(tangent))
  // Update controls
  // 1. Get slope at current position
  const tangent = curve.getTangentAt(progress);
  const slope = tangent.y;

  // 2. Modify velocity based on slope
  let velocity = parameters.velocity;
  velocity += (-slope) * parameters.gravity * 0.01;

  // 3. Optional: damp toward base speed (prevents runaway speed)
  velocity += (parameters.speed - velocity) * 0.02;

  // 4. Clamp speed (important)
  velocity = Math.max(parameters.minVelocity, Math.min(parameters.maxVelocity, velocity));

  // 5. Move forward
  progress += velocity;
  progress = wrap01(progress);


  for (let i = 0; i < boxes.length; i++) {
    
    let coachProgress = progress - (i * distBetweenBox);
    coachProgress = wrap01(coachProgress);

    const position = curve.getPointAt(coachProgress);
    boxes[i].position.copy(position);

    const tangent = curve.getTangentAt(coachProgress).normalize();
    boxes[i].lookAt(position.clone().add(tangent));
  }

  controls.update()

  // Render
  renderer.render(scene, camera)
}


/*=============================================
=            Events setup            =
=============================================*/
window.addEventListener('resize', e => {
  parameters.canvasWidth = window.innerWidth;
  parameters.canvasHeight = window.innerHeight;

  renderer.setSize(parameters.canvasWidth, parameters.canvasHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  camera.aspect = parameters.canvasWidth / parameters.canvasHeight;
  camera.updateProjectionMatrix();
})


const mouse = new THREE.Vector2();
window.addEventListener('mousemove', e => {

  mouse.x = e.clientX / parameters.canvasWidth * 2 - 1
  mouse.y = -(e.clientY / parameters.canvasHeight) * 2 + 1


})




