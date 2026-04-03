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
let roboModel = null;
// let mixer = null
gltfLoader.load("/models/test/box_anim_1.glb",
  (gltf) => {
    // console.log(gltf);
    roboModel = gltf.scene;

    roboModel.scale.set(0.25, 0.25, 0.25);
    // mixer = new THREE.AnimationMixer(roboModel)
    // const action = mixer.clipAction(gltf.animations[2])
    // action.play()
    scene.add(roboModel);
    animateRobo(gltf, roboModel);
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
var threeAnimation = null;
function animateRobo(gltf, roboModel) {

  // console.log("modal => ",gltf);
  const animations = gltf.animations;
  console.log(animations);
  
  
 threeAnimation =  new THREE.AnimationMixer(roboModel);

 const circularAnim = threeAnimation.clipAction(animations[0]);
 const rotateAnim = threeAnimation.clipAction(animations[1]);
 const scaleAnim = threeAnimation.clipAction(animations[2]);
 circularAnim.play();
 rotateAnim.play();
 scaleAnim.play();
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
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
  })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
floor.position.y = -1
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
function animation() {

  //elapsed time
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  if(threeAnimation)
    {
        threeAnimation.update(deltaTime)
    }

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



// window.addEventListener('mousemove', e => {
//   const x = e.clientX;
//   const y = e.clientY;
//   const rotateValue = mapToRange(x, y);

//   roboModel.rotation.y = rotateValue.x;
//   roboModel.rotation.z = rotateValue.y;

// })




