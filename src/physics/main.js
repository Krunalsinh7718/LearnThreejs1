import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";
import { SplitText } from "https://cdn.skypack.dev/gsap/SplitText";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as CANNON from "cannon-es"


/*=============================================
=            common variables            =
=============================================*/
const parameters = {
  canvasWidth: window.innerWidth,
  canvasHeight: window.innerHeight,
  color: "#90da8b",
  createSphereShape: function(){

    const radius = Math.max(Math.min(Math.random(), 0.5), 0.1);
    const position = {x : Math.random() * 2, y : 6, z : Math.random() * 2}
    createSphear(radius, position)
  },
  createBoxShape : function(){
    const size = {
      h : Math.random(),
      w : Math.random(),
      d : Math.random()
    }
    const position = {x : Math.random() * 2, y : 6, z : Math.random() * 2};
    createBox(size, position)
  }
}

/*=============================================
=            GUI setup            =
=============================================*/
const gui = new GUI();
gui.add(parameters, "createSphereShape" )
gui.add(parameters, "createBoxShape" )

/*=============================================
=            texture setup            =
=============================================*/
const lodingManager = new THREE.LoadingManager();
lodingManager.onStart = () => {
  console.log('Loading started');
};
lodingManager.onLoad = () => {
  console.log('Loading complete');
};
lodingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log(`Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
};
lodingManager.onError = (url) => {
  console.error(`There was an error loading ${url}`);
};

const textureLoader = new THREE.TextureLoader(lodingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(lodingManager)

const environmentMapTexture = cubeTextureLoader.load([
  './assets/textures/environmentMaps/0/px.png',
  './assets/textures/environmentMaps/0/nx.png',
  './assets/textures/environmentMaps/0/py.png',
  './assets/textures/environmentMaps/0/ny.png',
  './assets/textures/environmentMaps/0/pz.png',
  './assets/textures/environmentMaps/0/nz.png'
])

/*=============================================
=            Scene and world setup            =
=============================================*/
const scene = new THREE.Scene();

const world = new CANNON.World({
  gravity: { x: 0, y: -9.82, z: 0 },
})
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;

/*=============================================
=            world material            =
=============================================*/
const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.3
  }
)
world.defaultContactMaterial = defaultContactMaterial;

/*=============================================
=            Camera setup            =
=============================================*/
const camera = new THREE.PerspectiveCamera(75, parameters.canvasWidth / parameters.canvasHeight, 0.1, 100)
camera.position.set(- 3, 3, 3)
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
=           create mesh and body         =
=============================================*/

const objectsToUpdate = [];


const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5
})
const createSphear = (radius, position) => {
  const mesh = new THREE.Mesh(sphereGeo, material);
  mesh.scale.set(radius, radius, radius);
  mesh.position.copy(position)
  scene.add(mesh)

  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    shape: shape,
  })
  body.position.copy(position)
  world.addBody(body)

  objectsToUpdate.push({
    mesh: mesh,
    body: body,
    copyBodyPosToMesh() {
      this.mesh.position.copy(this.body.position);
    }
  })
}

const createBox = (size, position) => {
  const mesh = new THREE.Mesh(boxGeo, material);
  mesh.scale.set(size.h, size.w, size.d);
  mesh.position.copy(position)
  scene.add(mesh)

  const shape = new CANNON.Box(new CANNON.Vec3(
    size.h * 0.5, 
    size.w * 0.5, 
    size.d * 0.5
  ))
  const body = new CANNON.Body({
    mass: 1,
    shape: shape,
  })
  body.position.copy(position)
  world.addBody(body)

  objectsToUpdate.push({
    mesh: mesh,
    body: body,
    copyBodyPosToMesh() {
      this.mesh.position.copy(this.body.position);
      this.mesh.quaternion.copy(this.body.quaternion)
    }
  })
}


/*=============================================
=            floor            =
=============================================*/
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
  })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0,
  shape: floorShape
})
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI * 0.5
)
world.addBody(floorBody)

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

  // Update controls
  controls.update()

  //update shape position
  for(const shape of objectsToUpdate){
    shape.copyBodyPosToMesh()
  }

  //update world
  world.step(1 / 60, deltaTime, 3);

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








