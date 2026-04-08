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
=           mesh          =
=============================================*/



/*=============================================
=            path            =
=============================================*/
//Create a closed wavey loop
const curve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( -10, 0, 10 ),
	new THREE.Vector3( -5, 5, 5 ),
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( 5, -5, 5 ),
	new THREE.Vector3( 10, 0, 10 )
], true );
console.log(curve.getLength());

const points = curve.getPoints( 50 );
const geometry = new THREE.BufferGeometry().setFromPoints( points );
const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
// Create the final object to add to the scene
const curveObject = new THREE.Line( geometry, material );
scene.add(curveObject);


const boxGeometry = new THREE.BoxGeometry(1,1,1);
const boxMaterial = new THREE.MeshStandardMaterial({
  color: "blue"
})
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

/*=============================================
=            lights            =
=============================================*/
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)


/*=============================================
=            animation loop            =
=============================================*/
const clock = new THREE.Clock();
function animation() {

  //elapsed time
  const elapsedTime = clock.getElapsedTime();

  const progress = (elapsedTime * 0.08) % 1;
  const position = curve.getPointAt(progress) ;
  // console.log(position, curve.getPoint(position));
  box.position.copy(position);
  
  const tangent = curve.getTangentAt(progress).normalize();
  box.lookAt(position.clone().add(tangent))
  // Update controls
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




