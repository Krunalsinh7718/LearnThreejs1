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
const lodingManager = new THREE.LoadingManager();
lodingManager.onStart = () => {
  console.log('Loading started');
};
lodingManager.onLoad = () => {
  console.log('Loading complete');
  pushModels();
};
lodingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log(`Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
};
lodingManager.onError = (url) => {
  console.error(`There was an error loading ${url}`);
};

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/loaders/draco/')
const gltfLoader = new GLTFLoader(lodingManager);
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
=            train mountain model            =
=============================================*/
gltfLoader.load("/models/train-mountain/train-mou.glb", loadedModel => {
  // console.log(loadedModel);
  const model = loadedModel.scene;
  model.translateY(-0.3);
  scene.add(model)
})

let trainModal = null;
gltfLoader.load("/models/train/train.glb", loadedModel => {
  // console.log(loadedModel);
  trainModal = loadedModel.scene;
  trainModal.scale.set(0.09, 0.09, 0.09);
})

let trainContainerModal = null;
gltfLoader.load("/models/train/train-container.glb", loadedModel => {
  // console.log(loadedModel);
  trainContainerModal = loadedModel.scene;
  trainContainerModal.scale.set(0.09, 0.09, 0.09);
})



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

const array = [{'co': [3.824968099594116, 7.411521911621094, 0.9006749987602234], 'handle_left': [3.1233601570129395, 7.7616496086120605, 0.9006749987602234], 'handle_right': [4.689826965332031, 6.924868106842041, 0.9006749987602234]}, {'co': [6.362407207489014, 4.0894269943237305, 0.9006749987602234], 'handle_left': [5.232858180999756, 6.145168781280518, 0.9006749391555786], 'handle_right': [7.1522746086120605, 1.991682529449463, 0.9006749987602234]}, {'co': [6.736850738525391, -0.7700600624084473, 0.9006749987602234], 'handle_left': [6.878983020782471, 0.7792797088623047, 0.9006749987602234], 'handle_right': [6.441346645355225, -3.2888059616088867, 0.9006749987602234]}, {'co': [3.952467918395996, -7.207394123077393, 0.9006749987602234], 'handle_left': [5.223544120788574, -5.426041126251221, 0.9006749391555786], 'handle_right': [2.7015459537506104, -9.116573333740234, 0.9006749391555786]}, {'co': [-0.41976815462112427, -10.1514310836792, 0.9006749987602234], 'handle_left': [1.4400440454483032, -9.831940650939941, 0.9006749987602234], 'handle_right': [-2.8484039306640625, -10.380192756652832, 0.9006749987602234]}, {'co': [-6.272284030914307, -7.156125068664551, 0.9006749987602234], 'handle_left': [-5.07672643661499, -9.364068031311035, 0.9006749987602234], 'handle_right': [-7.134950160980225, -4.8485307693481445, 0.9006749987602234]}, {'co': [-5.151149272918701, -2.017899513244629, 1.388412594795227], 'handle_left': [-6.707982540130615, -3.3883752822875977, 1.0054655075073242], 'handle_right': [-3.7180771827697754, -1.118951439857483, 1.5505293607711792]}, {'co': [-0.31602877378463745, -1.7932137250900269, 1.7270091772079468], 'handle_left': [-2.123215913772583, -0.8411416411399841, 1.6401113271713257], 'handle_right': [1.0152006149291992, -2.473630905151367, 2.0279481410980225]}, {'co': [2.712951898574829, -5.950531482696533, 2.08113956451416], 'handle_left': [3.0899710655212402, -3.894792079925537, 1.9440864324569702], 'handle_right': [2.110588312149048, -7.987324237823486, 2.266136407852173]}, {'co': [-2.2956817150115967, -8.557552337646484, 2.349116325378418], 'handle_left': [-0.04264555871486664, -8.662153244018555, 2.12648344039917], 'handle_right': [-4.181864261627197, -8.313078880310059, 2.369919776916504]}, {'co': [-6.661752223968506, -3.599201202392578, 2.6022403240203857], 'handle_left': [-5.530831336975098, -6.665637016296387, 2.6883773803710938], 'handle_right': [-7.563840866088867, 0.11435604095458984, 2.065236806869507]}, {'co': [-7.223109722137451, 4.944981575012207, 1.4156330823898315], 'handle_left': [-7.9580278396606445, 2.084031581878662, 1.6784005165100098], 'handle_right': [-6.363451957702637, 7.830770969390869, 1.1973612308502197]}, {'co': [-1.9479942321777344, 8.757713317871094, 0.9372392296791077], 'handle_left': [-4.404637813568115, 8.750936508178711, 1.1973612308502197], 'handle_right': [0.54603511095047, 8.732998847961426, 0.9337076544761658]}, {'co': [3.7498342990875244, 7.4387125968933105, 0.9176567196846008], 'handle_left': [1.678403615951538, 8.86124324798584, 1.1777786016464233], 'handle_right': [5.721007347106934, 6.150500297546387, 0.9141250252723694]}];


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


// const box = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(box);

/*=============================================
=            train  model            =
=============================================*/


function pushModels(){
  for (let i = 0; i < boxCount; i++) {
  if(i !== 0){
    // const box = new THREE.Mesh(
    //     boxGeometry,
    //     boxMaterial
    // )
    const container = trainContainerModal.clone();
    boxes.push(container);
    scene.add(container);
  }else{
    
    boxes.push(trainModal);
    scene.add(trainModal);
  }
  }
  
}

/*=============================================
=            lights            =
=============================================*/
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight("rgb(255, 230, 0)", 2);
directionalLight.position.set(5, 10, 5)
scene.add(directionalLight);
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001).name( 'directionalLight intensity' );

const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(dirLightHelper)
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

if(trainModal){
  for (let i = 0; i < boxes.length; i++) {
    
    let coachProgress = progress - (i * distBetweenBox);
    coachProgress = wrap01(coachProgress);

    const position = curve.getPointAt(coachProgress);
    boxes[i].position.copy(position);

    const tangent = curve.getTangentAt(coachProgress).normalize();
    boxes[i].lookAt(position.clone().add(tangent));
  }
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




