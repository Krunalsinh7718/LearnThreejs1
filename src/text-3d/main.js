import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from "gsap";
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/Addons.js';
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import GUI from 'lil-gui';

// GUI setup
// const gui = new GUI();

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5); // Move the camera up and back
camera.lookAt(0, 0, 0);

//renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//text font setup
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
  console.log(`There was an error loading ${url}`);
};

const textureLoader = new THREE.TextureLoader(lodingManager);
const matcapTexture = textureLoader.load('./assets/textures/matcaps/8.png');
matcapTexture.colorSpace = THREE.SRGBColorSpace

const groupMain = new THREE.Group();
const groupChild = new THREE.Group();

gsap.to(groupChild.rotation, {
  y: Math.PI * 0.2,
  ease: "sine.inOut",
})

gsap.to(groupChild.rotation, {
  // y : Math.PI * -0.2,
  z: Math.PI * 0.5,
 
  duration: 8,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  overwrite: "auto",
})

gsap.to(groupChild.rotation, {
  // y : Math.PI * -0.2,
 
  x: Math.PI * 0.5,
  duration: 12,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  overwrite: "auto",
})

groupMain.add(groupChild);
scene.add(groupMain);


async function loadFont() {
  const loader = new FontLoader();
  const font = await loader.loadAsync('/fonts/helvetiker_regular.typeface.json');

  const geometry = new TextGeometry('Hello Three.js', {
    font: font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 6,
    bevelEnabled: false,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });
  geometry.center();
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
  // const material = new THREE.MeshBasicMaterial({color: "red"})
  const text = new THREE.Mesh(geometry, material)
  groupMain.add(text)


  const torusGeo = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
  for (let index = 0; index < 100; index++) {
    const torus = new THREE.Mesh(torusGeo, material);
    torus.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
    )

    torus.rotation.x = Math.random() * Math.PI
    torus.rotation.y = Math.random() * Math.PI

    const scale = Math.random() + 0.2
    torus.scale.set(scale, scale, scale)

    groupChild.add(torus)

  }
}

// Load text
loadFont();

const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;


//animation loop
const clock = new THREE.Clock();

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let pos = { x: mouse.x, y: mouse.y };

function animate() {
  const speed = 0.1;
  const minInput = 0;
  const maxInput = window.innerWidth;
  const minOutput = -5;
  const maxOutput = 5;

  // LERP: move slightly toward target
  pos.x += (mouse.x - pos.x) * speed;
  pos.y += (mouse.y - pos.y) * speed;

  const mappedValue =
    ((pos.x - minInput) / (maxInput - minInput)) *
    (maxOutput - minOutput) + minOutput;

  camera.position.x = mappedValue;
  camera.position.y = mappedValue * 0.5;

  controls.update();
  renderer.render(scene, camera);
}

//handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


window.addEventListener("mousemove", (event) => {

  mouse.x = event.clientX;
  mouse.y = event.clientY;

});