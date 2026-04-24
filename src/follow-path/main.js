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
}

/*=============================================
=            GUI setup            =
=============================================*/
const gui = new GUI();


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
function animation() {

  //elapsed time
  const elapsedTime = clock.getElapsedTime();

  // const progress = (elapsedTime * 0.08) % 1;
  
  // const position = curve.getPointAt(progress) ;
  
  // box.position.copy(position);
  
  // const tangent = curve.getTangentAt(progress).normalize();
  // box.lookAt(position.clone().add(tangent))
  // Update controls


  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];

    const progress = ((elapsedTime * 0.08) % 1) + (i * 0.027);
  
    const position = curve.getPointAt(progress);

    // console.log(progress);
    
    
    box.position.copy(position);
    
    const tangent = curve.getTangentAt(progress).normalize();
    box.lookAt(position.clone().add(tangent))

    
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




