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
let mixer = null
let gltfModel = null;
gltfLoader.load("/models/Fox/glTF/Fox.gltf",
  (gltf) => {
    gltfModel = gltf.scene;
    gltfModel.scale.set(0.025, 0.025, 0.025)

    scene.add(gltfModel)
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

/*=============================================
=            Scene and world setup            =
=============================================*/
const scene = new THREE.Scene();

/*=============================================
=            Camera setup            =
=============================================*/
const camera = new THREE.PerspectiveCamera(75, parameters.canvasWidth / parameters.canvasHeight, 0.1, 100)
camera.position.set(5, 5, 10)
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
const geomatry = new THREE.SphereGeometry(0.5, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: "red" });
const mesh1 = new THREE.Mesh(geomatry, new THREE.MeshStandardMaterial({ color: "red" }));
mesh1.position.set(-3, 0, 0);

const mesh2 = new THREE.Mesh(geomatry, new THREE.MeshStandardMaterial({ color: "red" }));
mesh2.position.set(0, 0, 0);

const mesh3 = new THREE.Mesh(geomatry, new THREE.MeshStandardMaterial({ color: "red" }));
mesh3.position.set(3, 0, 0);

const meshes = [mesh1, mesh2, mesh3];

scene.add(mesh1, mesh2, mesh3)

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
=            Raycaster            =
=============================================*/

const raycaster = new THREE.Raycaster();
// const rayOrigin = new THREE.Vector3(-6, 0, 0);
// const rayDirection = new THREE.Vector3(6, 0, 0);
// rayDirection.normalize();
// raycaster.set(rayOrigin, rayDirection);


//  const rayOrigin = new THREE.Vector3(- 10, 0, 0)
//   const rayDirection = new THREE.Vector3(10, 0, 0)
//   rayDirection.normalize()

//   raycaster.set(rayOrigin, rayDirection)

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

  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(meshes)


  if (intersects.length) {
    if (!currentIntersect) {
      // console.log('mouse enter')
    }

    currentIntersect = intersects[0]
  }
  else {
    if (currentIntersect) {
      // console.log('mouse leave')
    }

    currentIntersect = null
  }

  for (const object of meshes) {
    if (!intersects.find(intersect => intersect.object === object)) {
      object.material.color.set('#ff0000')
    }
  }

  for (const intersect of intersects) {
    intersect.object.material.color.set('#0000ff')
  }

  if(gltfModel){
    const modelIntersects = raycaster.intersectObject(gltfModel)
     if(modelIntersects.length)
        {
            gltfModel.scale.set(0.03, 0.03, 0.03)
        }
        else
        {
            gltfModel.scale.set(0.025, 0.025, 0.025)
        }
  }

  //animate meshes
  meshes[0].position.y = Math.sin(elapsedTime * 0.6) * 3
  meshes[1].position.y = Math.sin(elapsedTime * 0.5) * 3
  meshes[2].position.y = Math.sin(elapsedTime * 0.4) * 3

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


/*=============================================
=            mousemove            =
=============================================*/
const mouse = new THREE.Vector2();
window.addEventListener("mousemove", e => {
  mouse.x = e.clientX / parameters.canvasWidth * 2 - 1
  mouse.y = -(e.clientY / parameters.canvasHeight) * 2 + 1
})


/*=============================================
=            click            =
=============================================*/
window.addEventListener('click', () => {
  if (currentIntersect) {
    switch (currentIntersect.object) {
      case mesh1:
        console.log('click on mesh 1')
        break

      case mesh2:
        console.log('click on mesh 2')
        break

      case mesh3:
        console.log('click on mesh 3')
        break
    }
  }
})







