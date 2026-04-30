import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { blenderToThree } from "../common/utilityFunctions";


/*=============================================
=            common variables            =
=============================================*/
const parameters = {
  canvasWidth: window.innerWidth,
  canvasHeight: window.innerHeight,
  speed: 0.002,
  gravity: 0.15,
  velocity: 0.0008,
  minVelocity : 0.000,
  maxVelocity: 0.08,
  trainBoxGap : 1,
  // Math.max(0.005, Math.min(0.08, velocity));
}

/*=============================================
=            GUI setup            =
=============================================*/
const gui = new GUI();
gui.add(parameters, "speed").min(0).max(0.008).step(0.0001);
gui.add(parameters, "gravity").min(0).max(1).step(0.01);
gui.add(parameters, "velocity").min(0.0001).max(0.007).step(0.0001);
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
// const edgeOffset = 10;
// const curve = new THREE.CatmullRomCurve3( [
// 	new THREE.Vector3( planeStart + edgeOffset, 0, planeStart + edgeOffset),
// 	new THREE.Vector3( planeStart + edgeOffset, 10, 0),
// 	new THREE.Vector3( planeStart + edgeOffset, 0, planeEnd - edgeOffset),
// 	new THREE.Vector3( planeEnd - edgeOffset, 0, planeEnd - edgeOffset),
// 	new THREE.Vector3( planeEnd - edgeOffset, 0, planeStart + edgeOffset),
	
// ], true );
// console.log(curve.getLength());

const array = [{'co': [0.4929530620574951, 0.4722820818424225, 7.450580596923828e-08], 'handle_left': [-0.21574188768863678, 0.8224093914031982, 7.404014468193054e-08], 'handle_right': [1.3665478229522705, -0.014372050762176514, 7.450580596923828e-08]}, {'co': [2.970548152923584, -2.8665847778320312, 4.470348358154297e-08], 'handle_left': [1.8295891284942627, -0.8108428716659546, 1.4901161193847656e-08], 'handle_right': [3.7683942317962646, -4.964329242706299, 5.960464477539063e-08]}, {'co': [3.348773956298828, -7.726071834564209, 4.470348358154297e-08], 'handle_left': [3.492341995239258, -6.176732063293457, 4.470348358154297e-08], 'handle_right': [3.0502848625183105, -10.244817733764648, 4.470348358154297e-08]}, {'co': [0.6088757514953613, -14.209184646606445, 4.470348358154297e-08], 'handle_left': [1.8927912712097168, -12.427831649780273, 0.0], 'handle_right': [-0.6546816825866699, -16.118364334106445, -7.450580596923828e-09]}, {'co': [-3.7732529640197754, -17.206239700317383, 5.960464477539063e-08], 'handle_left': [-1.8946547508239746, -16.886749267578125, 8.195638656616211e-08], 'handle_right': [-6.2264204025268555, -17.435001373291016, 5.960464477539063e-08]}, {'co': [-9.791766166687012, -14.112136840820312, 4.470348358154297e-08], 'handle_left': [-8.584132194519043, -16.320079803466797, 4.470348358154297e-08], 'handle_right': [-10.663146018981934, -11.804542541503906, 5.960464477539063e-08]}, {'co': [-8.633190155029297, -8.869396209716797, 0.49266427755355835], 'handle_left': [-10.205748558044434, -10.239871978759766, 0.1058489978313446], 'handle_right': [-7.185642719268799, -7.970448017120361, 0.6564186811447144]}, {'co': [-3.7316806316375732, -8.671963691711426, 0.8346810340881348], 'handle_left': [-5.557122230529785, -7.719891548156738, 0.7469054460525513], 'handle_right': [-2.200498104095459, -9.348413467407227, 1.1386597156524658]}, {'co': [-0.7274508476257324, -12.981939315795898, 1.1923885345458984], 'handle_left': [-0.34662342071533203, -10.926199913024902, 1.0539512634277344], 'handle_right': [-1.3358988761901855, -15.018732070922852, 1.3792539834976196]}, {'co': [-5.808773994445801, -15.576559066772461, 1.4630720615386963], 'handle_left': [-3.532979965209961, -15.681159973144531, 1.2381905317306519], 'handle_right': [-7.714008808135986, -15.332085609436035, 1.4840857982635498]}, {'co': [-10.185168266296387, -10.55521297454834, 1.7187528610229492], 'handle_left': [-9.042823791503906, -13.621648788452148, 1.8057600259780884], 'handle_right': [-11.096368789672852, -6.841655731201172, 1.1763252019882202]}, {'co': [-10.752196311950684, -2.0110301971435547, 0.5201597213745117], 'handle_left': [-11.494538307189941, -4.8719801902771, 0.7855814099311829], 'handle_right': [-9.883854866027832, 0.8747591972351074, 0.299683153629303]}, {'co': [-5.4448747634887695, 1.8823896646499634, 0.03693366050720215], 'handle_left': [-7.926332950592041, 1.875612735748291, 0.2996830940246582], 'handle_right': [-2.9256532192230225, 1.8576756715774536, 0.03336639702320099]}, {'co': [0.41706034541130066, 0.49947285652160645, 0.03693373501300812], 'handle_left': [-1.6752938032150269, 1.9220037460327148, 0.2996830940246582], 'handle_right': [2.408144474029541, -0.7887396812438965, 0.033366404473781586]}];


const blenderPoints = array;

const curve = new THREE.CurvePath();
curve.closed = true;

for (let i = 0; i < blenderPoints.length - 1; i++) {
  const current = blenderPoints[i];
  const next = blenderPoints[i + 1];

  const p0 = blenderToThree(current.co);
  const h1 = blenderToThree(current.handle_right);
  const h2 = blenderToThree(next.handle_left);
  const p1 = blenderToThree(next.co);

  const segment = new THREE.CubicBezierCurve3(p0, h1, h2, p1);
  curve.add(segment);
}

const points = curve.getPoints( 50 );
const geometry = new THREE.BufferGeometry().setFromPoints( points );
const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
// Create the final object to add to the scene
const curveObject = new THREE.Line( geometry, material );
scene.add(curveObject);

const boxCount = 5;
const boxes = [];
const boxGeometry = new THREE.BoxGeometry(0.25,0.25,0.75);
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




