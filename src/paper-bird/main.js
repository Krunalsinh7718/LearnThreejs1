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
=            Raycaster            =
=============================================*/

const raycaster = new THREE.Raycaster();

/*=============================================
=            Models            =
=============================================*/
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/loaders/draco/')
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader)
let roboModel = null;
let threeAnimationMixer = null;
let modelAnimations = null;
let modelAnimStep1 = null, modelAnimStep2 = null, modelAnimStep3 = null;
let animFunctions = {
  step1 : function(){
    modelAnimStep1.play();
  },
  step2 : function(){
    modelAnimStep2.play();
  },
  step3 : function(){
    modelAnimStep3.play();
  },
}
// let mixer = null
// gltfLoader.load("/models/robo/scene.gltf",
gltfLoader.load("/models/paper-bird/paper-bird-2.glb",
  (gltf) => {
    console.log(gltf);
    roboModel = gltf.scene;

    threeAnimationMixer = new THREE.AnimationMixer(roboModel);
    modelAnimations = gltf.animations;
    console.log();


    modelAnimStep1 = threeAnimationMixer.clipAction(modelAnimations[0]);
    modelAnimStep2 = threeAnimationMixer.clipAction(modelAnimations[1]);
    modelAnimStep3 = threeAnimationMixer.clipAction(modelAnimations[2]);

    //  roboHeadWaveAnim.play();
    //  roboHandWaveAnim.play();

    gui.add(animFunctions, "step1").name("step 1");
    gui.add(animFunctions, "step2").name("step 2");
    gui.add(animFunctions, "step3").name("step 3");

    roboModel.scale.set(0.25, 0.25, 0.25);
    // mixer = new THREE.AnimationMixer(roboModel)
    // const action = mixer.clipAction(gltf.animations[2])
    // action.play()
    scene.add(roboModel);
    // animateRobo();
  },
  (progress) => {
    console.log('progress')
    console.log(progress)
  },
  (error) => {
    console.log('error')
    console.log(error)
  }
)

function animateRobo() {
  roboModel.rotation.y = 0.78;
  gsap.to(roboModel.position, {
    y: 1,
    duration: 2,
    yoyo: true,
    repeat: -1
  })

}

function mapToRange(valueX, valueY) {
  const minInput = 0;
  const maxInputX = window.innerWidth;
  const maxInputY = window.innerHeight;

  const minOutput = -0.78;
  const maxOutput = 0.78;

  return {
    x: (
      ((valueX - minInput) * (maxOutput - minOutput)) /
      (maxInputX - minInput) +
      minOutput
    ),
    y: (
      ((valueY - minInput) * (maxOutput - minOutput)) /
      (maxInputY - minInput) +
      minOutput
    )
  }
    ;
}

/*=============================================
=            Scene and world setup            =
=============================================*/
const scene = new THREE.Scene();

/*=============================================
=            Camera setup            =
=============================================*/
const camera = new THREE.PerspectiveCamera(75, parameters.canvasWidth / parameters.canvasHeight, 0.1, 100)
camera.position.set(-8, 2, 0)
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
=            floor            =
=============================================*/
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({
    color: '#fcd8c1',
    metalness: 0.3,
    roughness: 0.4,
  })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
floor.position.y = -5;
scene.add(floor)

/*=============================================
=            lights            =
=============================================*/
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/*=============================================
=            animation loop            =
=============================================*/
const clock = new THREE.Clock();
let previousTime = 0;
let currentIntersect = null;
function animation() {

  //elapsed time
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  if (threeAnimationMixer) {
    threeAnimationMixer.update(deltaTime)
  }

  // raycaster.setFromCamera(mouse, camera)


  // if (roboModel) {
  //   const intersects = raycaster.intersectObjects([roboModel])
  //   if (intersects.length) {
  //     if (!currentIntersect ) {
  //       // console.log('mouse enter');
  //       playHandWave();
  //       stopHeadWave();
  //     }

  //     currentIntersect = intersects[0]
  //   }
  //   else {
  //     if (currentIntersect) {
  //       // console.log('mouse leave')
  //       stopHandWave();
  //       playHeadWave();
  //       // roboHandWaveAnim.reset();
  //     }

  //     currentIntersect = null
  //   }
  // }


  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)
}

function playHandWave() {
  roboHandWaveAnim.play();
  roboHandWaveAnim.crossFadeFrom(roboHandWaveAnim,1);
}
function stopHandWave() {
  roboHandWaveAnim.stop();
}
function playHeadWave() {
  roboHeadWaveAnim.play();
  roboHeadWaveAnim.crossFadeFrom(roboHandWaveAnim,1);
}
function stopHeadWave() {
  roboHeadWaveAnim.stop();
}


//  roboHeadWaveAnim.play();
//  roboHandWaveAnim.play();

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
// window.addEventListener('mousemove', e => {

//   mouse.x = e.clientX / parameters.canvasWidth * 2 - 1
//   mouse.y = -(e.clientY / parameters.canvasHeight) * 2 + 1

//   const x = e.clientX;
//   const y = e.clientY;
//   const rotateValue = mapToRange(x, y);

//   if (roboModel) {
//     roboModel.rotation.y = rotateValue.x;
//     roboModel.rotation.z = rotateValue.y;
//   }

// })




