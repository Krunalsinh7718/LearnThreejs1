import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { blenderToThree } from "../common/utilityFunctions";
import { getMeshesByName } from "../common/utilityFunctions";


/*=============================================
=            common variables            =
=============================================*/
const loading = document.querySelector(".loading");
const sliderCount = document.querySelector(".count");
const sliderProgress = document.querySelector(".slider-progress");
const parameters = {
  canvasWidth: window.innerWidth,
  canvasHeight: window.innerHeight,
  speed: 0.002,
  gravity: 0.15,
  velocity: 0.0008,
  minVelocity: 0.000,
  maxVelocity: 0.08,
  trainBoxGap: 1,
  debug: false,
  trainDriverViewEnable : false,
  setSunsetView: function() { 
     setPosition(false, new THREE.Vector3(-2, 6, -4), new THREE.Vector3( 2,3,4 ));
  },
  setWaterfallView: function() { 
     setPosition(false, new THREE.Vector3( 1, 4, 3 ), new THREE.Vector3( 0, 2, -3 ));
  },
  setTrainDriverView: function() { 
     setPosition(true, new THREE.Vector3(5, 4, -3), new THREE.Vector3(5, 4, -3));
  },
  // Math.max(0.005, Math.min(0.08, velocity));
}

/*=============================================
=            GUI setup            =
=============================================*/
const gui = new GUI();
// gui.add(parameters, "speed").min(0).max(0.008).step(0.0001);
gui.add(parameters, "gravity").min(0).max(1).step(0.01).name("Train Gravity");
gui.add(parameters, "velocity").min(0.0001).max(0.007).step(0.0001).name("Train Speed");
gui.add(parameters, "trainBoxGap").min(1).max(3).step(0.1).name("Train box gap");
gui.add(parameters, "debug").name("Debug").onChange(e => {
  // console.log(e);
  parameters.debug = e;
  curveObject.visible = parameters.debug;

  dirLightSunHelper.visible = parameters.debug;
  directionLightSunShadowHelper.visible = parameters.debug;

  dirLightMoonHelper.visible = parameters.debug;
  directionLightMoonShadowHelper.visible = parameters.debug;

  axisHelper.visible = parameters.debug;
});
gui.add(parameters, "setSunsetView").name("Sunset View");
gui.add(parameters, "setWaterfallView").name("Waterfall View");
gui.add(parameters, "setTrainDriverView").name("Train Driver View");


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
  const percent = (itemsLoaded * 100) / itemsTotal;
  console.log(`Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
  sliderCount.innerHTML = Math.floor(percent);
  sliderProgress.style.width = `${percent}%`;
  if(percent === 100){
    loading.classList.add("hide");
  }

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
gltfLoader.load("/models/train-mountain/train-mou-2.glb", loadedModel => {
  // console.log(loadedModel);
  const model = loadedModel.scene;
  console.log(model);

  model.translateY(-0.3);
  scene.add(model)

  const meshes1 = getMeshesByName(model, "earth");
  const meshes2 = getMeshesByName(model, "cloud");
  [...meshes1, ...meshes2].forEach(mesh => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  })
  // console.log("cloud", meshes2);
})

let trainModal = null;
gltfLoader.load("/models/train/train.glb", loadedModel => {
  // console.log(loadedModel);
  trainModal = loadedModel.scene;
  trainModal.castShadow = true;
  trainModal.receiveShadow = true;
  trainModal.scale.set(0.09, 0.09, 0.09);
})

let trainContainerModal = null;
gltfLoader.load("/models/train/train-container.glb", loadedModel => {
  // console.log(loadedModel);
  trainContainerModal = loadedModel.scene;
  trainContainerModal.castShadow = true;
  trainContainerModal.receiveShadow = true;
  trainContainerModal.scale.set(0.09, 0.09, 0.09);
})

/*=============================================
=           platform          =
=============================================*/
const planeSize = 80;
const halfPlane = planeSize * 0.5;
const planeStart = 0 - halfPlane;
const planeEnd = halfPlane;
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(planeSize, planeSize),
  new THREE.MeshBasicMaterial({
    color: "#48b9db",
    side: THREE.DoubleSide
  })
);
plane.position.y = -20;
plane.rotation.x = - Math.PI / 2;
scene.add(plane);


/*=============================================
=            path            =
=============================================*/
const array = [{ 'co': [3.824970006942749, 7.411520004272461, 0.9006749987602234], 'handle_left': [3.1233620643615723, 7.761647701263428, 0.9006749987602234], 'handle_right': [4.689828872680664, 6.924866199493408, 0.9006749987602234] }, { 'co': [6.362407207489014, 4.0894269943237305, 0.9006749987602234], 'handle_left': [5.383934497833252, 6.205161094665527, 0.9006749391555786], 'handle_right': [7.2013444900512695, 2.0077641010284424, 0.9006749987602234] }, { 'co': [6.736850738525391, -0.7700600624084473, 0.9006749987602234], 'handle_left': [6.878983020782471, 0.7792797088623047, 0.9006749987602234], 'handle_right': [6.441346645355225, -3.2888059616088867, 0.9006749987602234] }, { 'co': [3.952467918395996, -7.207394123077393, 0.9006749987602234], 'handle_left': [5.223544120788574, -5.426041126251221, 0.9006749391555786], 'handle_right': [2.7015459537506104, -9.116573333740234, 0.9006749391555786] }, { 'co': [-0.41976815462112427, -10.1514310836792, 0.9006749987602234], 'handle_left': [1.4400440454483032, -9.831940650939941, 0.9006749987602234], 'handle_right': [-2.8484039306640625, -10.380192756652832, 0.9006749987602234] }, { 'co': [-6.272284030914307, -7.156125068664551, 0.9006749987602234], 'handle_left': [-5.07672643661499, -9.364068031311035, 0.9006749987602234], 'handle_right': [-7.134950160980225, -4.8485307693481445, 0.9006749987602234] }, { 'co': [-5.151149272918701, -2.017899513244629, 1.388412594795227], 'handle_left': [-6.707982540130615, -3.3883752822875977, 1.0054655075073242], 'handle_right': [-3.7180771827697754, -1.118951439857483, 1.5505293607711792] }, { 'co': [-0.31602877378463745, -1.7932137250900269, 1.7270091772079468], 'handle_left': [-2.123215913772583, -0.8411416411399841, 1.6401113271713257], 'handle_right': [1.0152006149291992, -2.473630905151367, 2.0279481410980225] }, { 'co': [2.712951898574829, -5.950531482696533, 2.08113956451416], 'handle_left': [3.0899710655212402, -3.894792079925537, 1.9440864324569702], 'handle_right': [2.110588312149048, -7.987324237823486, 2.266136407852173] }, { 'co': [-2.2956817150115967, -8.557552337646484, 2.349116325378418], 'handle_left': [-0.04264555871486664, -8.662153244018555, 2.12648344039917], 'handle_right': [-4.181864261627197, -8.313078880310059, 2.369919776916504] }, { 'co': [-6.661752223968506, -3.599201202392578, 2.6022403240203857], 'handle_left': [-5.530831336975098, -6.665637016296387, 2.6883773803710938], 'handle_right': [-7.563840866088867, 0.11435604095458984, 2.065236806869507] }, { 'co': [-7.223109722137451, 4.944981575012207, 1.4156330823898315], 'handle_left': [-7.9580278396606445, 2.084031581878662, 1.6784005165100098], 'handle_right': [-6.363451957702637, 7.830770969390869, 1.1973612308502197] }, { 'co': [-1.9479942321777344, 8.757713317871094, 0.9372392296791077], 'handle_left': [-4.404637813568115, 8.750936508178711, 1.1973612308502197], 'handle_right': [0.54603511095047, 8.732998847961426, 0.9337076544761658] }, { 'co': [3.824970006942749, 7.411520004272461, 0.9006749987602234], 'handle_left': [1.7535393238067627, 8.834051132202148, 1.160796880722046], 'handle_right': [5.796143054962158, 6.123307704925537, 0.8971433043479919] }];

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

const points = curve.getPoints(50);
const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);
const curveMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
// Create the final object to add to the scene
const curveObject = new THREE.Line(curveGeometry, curveMaterial);
curveObject.visible = parameters.debug;
scene.add(curveObject);
/*=============================================
=            train  model            =
=============================================*/
const boxCount = 5;
const boxes = [];
function pushModels() {
  for (let i = 0; i < boxCount; i++) {
    if (i !== 0) {
      const container = trainContainerModal.clone();
      boxes.push(container);
      scene.add(container);
    } else {

      boxes.push(trainModal);
      scene.add(trainModal);
    }
  }

}
/*=============================================
=            Sun            =
=============================================*/
const lightPos = { x: 5, y: 10, z: 5 };
const sunGeometry = new THREE.SphereGeometry(0.5);
const sunMaterial = new THREE.MeshStandardMaterial({
  emissive: "yellow"
})
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(lightPos.x, lightPos.y, lightPos.z);
scene.add(sun);


/*=============================================
=            Moon            =
=============================================*/
const moonGeometry = new THREE.SphereGeometry(0.5);
const moonMaterial = new THREE.MeshStandardMaterial({
  emissive: "blue"
})
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(-lightPos.x, -lightPos.y, -lightPos.z);
scene.add(moon);

/*=============================================
=            lights            =
=============================================*/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

const directionalLightSun = new THREE.DirectionalLight("rgb(242, 247, 172)", 2);
directionalLightSun.target.position.set(0, -0.3, 0);
directionalLightSun.castShadow = true;
directionalLightSun.position.set(lightPos.x, lightPos.y, lightPos.z)

directionalLightSun.shadow.mapSize.width = 2048;
directionalLightSun.shadow.mapSize.height = 2048;

directionalLightSun.shadow.camera.near = 0.5;
directionalLightSun.shadow.camera.far = 40;

directionalLightSun.shadow.camera.left = -20;
directionalLightSun.shadow.camera.right = 20;
directionalLightSun.shadow.camera.top = 20;
directionalLightSun.shadow.camera.bottom = -20;

directionalLightSun.shadow.bias = -0.0005;
directionalLightSun.shadow.normalBias = 0.02;

scene.add(directionalLightSun.target);
scene.add(directionalLightSun);

gui.add(directionalLightSun, 'intensity').min(0).max(3).step(0.001).name('Sun Light Intensity');

const dirLightSunHelper = new THREE.DirectionalLightHelper(directionalLightSun);
dirLightSunHelper.visible = parameters.debug;
scene.add(dirLightSunHelper)

const directionLightSunShadowHelper = new THREE.CameraHelper(directionalLightSun.shadow.camera);

directionLightSunShadowHelper.visible = parameters.debug;
scene.add(directionLightSunShadowHelper);

const directionalLightMoon = new THREE.DirectionalLight("rgb(116, 129, 255)", 0.3);
directionalLightMoon.target.position.set(0, -0.3, 0);
directionalLightMoon.castShadow = true;
directionalLightMoon.position.set(-lightPos.x, -lightPos.y, -lightPos.z)

directionalLightMoon.shadow.mapSize.width = 2048;
directionalLightMoon.shadow.mapSize.height = 2048;

directionalLightMoon.shadow.camera.near = 0.5;
directionalLightMoon.shadow.camera.far = 40;

directionalLightMoon.shadow.camera.left = -20;
directionalLightMoon.shadow.camera.right = 20;
directionalLightMoon.shadow.camera.top = 20;
directionalLightMoon.shadow.camera.bottom = -20;

directionalLightMoon.shadow.bias = -0.0005;
directionalLightMoon.shadow.normalBias = 0.02;

scene.add(directionalLightMoon.target);
scene.add(directionalLightMoon);

gui.add(directionalLightMoon, 'intensity').min(0).max(3).step(0.001).name('Moon Light Intensity');

const dirLightMoonHelper = new THREE.DirectionalLightHelper(directionalLightMoon);
dirLightMoonHelper.visible = parameters.debug;
scene.add(dirLightMoonHelper)

const directionLightMoonShadowHelper = new THREE.CameraHelper(directionalLightMoon.shadow.camera);

directionLightMoonShadowHelper.visible = parameters.debug;
scene.add(directionLightMoonShadowHelper);

/*=============================================
=            Axis Helper            =
=============================================*/
const axisHelper = new THREE.AxesHelper(30);
axisHelper.visible = parameters.debug;
scene.add(axisHelper)

/*=============================================
=            LABEL RENDERER            =
=============================================*/
const labelRenderer = new CSS2DRenderer();

labelRenderer.setSize(
  window.innerWidth,
  window.innerHeight
);

labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';

document.body.appendChild(labelRenderer.domElement);

/*=============================================
=            HOTSPOTS            =
=============================================*/
createHotspot({
  position: new THREE.Vector3(-2, 6, -4),
  label: {index : 1, text: 'Sunset Point'},
  cameraPosition: new THREE.Vector3(-2, 6, -4),
  target: new THREE.Vector3( 2,3,4 )
});

createHotspot({
  position: new THREE.Vector3(1, 4, 3),
  label: {index : 2, text :'Waterfall View'},
  cameraPosition: new THREE.Vector3( 1, 4, 3 ),
  target: new THREE.Vector3( 0, 2, -3 )
});

createHotspot({
  position: new THREE.Vector3(5, 4, -3),
  label: {index : 3, text :'Train Driver View'},
  cameraPosition: new THREE.Vector3(5, 4, -3),
  target: new THREE.Vector3(5, 4, -3),
  trainDriverViewEnable : true
});

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

  const lightPositionX = Math.sin(elapsedTime * 0.1) * 15;
  const lightPositionY = Math.cos(elapsedTime * 0.1) * 15;
  const lightPositionZ = Math.sin(elapsedTime * 0.1) * 15;

  directionalLightSun.position.set(lightPositionX, lightPositionY, lightPositionZ);
  sun.position.set(lightPositionX, lightPositionY, lightPositionZ);

  directionalLightSun.target.updateMatrixWorld();
  if (dirLightSunHelper) dirLightSunHelper.update();
  if (directionLightSunShadowHelper) directionLightSunShadowHelper.update();


  directionalLightMoon.position.set(-lightPositionX, -lightPositionY, -lightPositionZ);
  moon.position.set(-lightPositionX, -lightPositionY, -lightPositionZ);

  directionalLightMoon.target.updateMatrixWorld();
  if (dirLightMoonHelper) dirLightMoonHelper.update();
  if (directionLightMoonShadowHelper) directionLightMoonShadowHelper.update();


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

  if (trainModal) {
    for (let i = 0; i < boxes.length; i++) {

      let coachProgress = progress - (i * distBetweenBox);
      coachProgress = wrap01(coachProgress);

      const position = curve.getPointAt(coachProgress);
      boxes[i].position.copy(position);


      const tangent = curve.getTangentAt(coachProgress).normalize();
      boxes[i].lookAt(position.clone().add(tangent));

      if (i === 0 && parameters.trainDriverViewEnable) {

        camera.position.copy(
          position.clone()
            .add(new THREE.Vector3(0, 0.5, 0)) // height
            .add(tangent.clone().multiplyScalar(-1)) // behind train
        );
        camera.lookAt(position.clone().add(tangent));
        controls.target = position.clone().add(tangent);
      }
    }
  }

  // update controls
  controls.update();

  // Render
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
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


// -----------------------------------
// HOTSPOT FUNCTION
// -----------------------------------

function createHotspot({
  position,
  label,
  cameraPosition,
  target,
  trainDriverViewEnable
}) {

  // HTML
  const wrapper = document.createElement('div');
  wrapper.className = 'hotspot-wrapper';

  const button = document.createElement('div');
  button.className = 'hotspot';
  button.innerHTML = label.index;

  const text = document.createElement('div');
  text.className = 'label';
  text.textContent = label.text;

  wrapper.appendChild(button);
  wrapper.appendChild(text);

  // Enable clicks
  button.style.pointerEvents = 'auto';

  // CSS2D Object
  const hotspot = new CSS2DObject(wrapper);

  hotspot.position.copy(position);

  // CLICK EVENT
  button.addEventListener('click', () => {
    setPosition(trainDriverViewEnable, cameraPosition, target);
  });

  scene.add(hotspot);
}

function setPosition(trainDriverViewEnable, cameraPosition, target){
  if(trainDriverViewEnable){
      parameters.trainDriverViewEnable = true;
      controls.enabled = false;
    }else{
       parameters.trainDriverViewEnable = false;
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
    }
}


