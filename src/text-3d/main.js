import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from "gsap";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/Addons.js';
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
const matcapTexture1 = textureLoader.load('./assets/textures/matcaps/4.png');
const matcapTexture2 = textureLoader.load('./assets/textures/matcaps/8.png');
matcapTexture1.colorSpace = THREE.SRGBColorSpace

const groupMain = new THREE.Group();
const groupChild = new THREE.Group();

//animate particles
gsap.to(groupChild.rotation, {
  y: Math.PI * 0.2,
  ease: "sine.inOut",
})

const gsapParticlesCommon = {
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  overwrite: "auto",
}
gsap.to(groupChild.rotation, {
  z: Math.PI * 0.5,
  duration: 8,
  ...gsapParticlesCommon
})

gsap.to(groupChild.rotation, {
  x: Math.PI * 0.5,
  duration: 12,
  repeat: -1,
  ...gsapParticlesCommon
})

groupMain.add(groupChild);
scene.add(groupMain);

const fonts = {
  helvetikerRegular : "helvetiker_regular.typeface.json",
  helvetikerBold : "helvetiker_bold.typeface.json",
  gentilisBold : "gentilis_bold.typeface.json",
  optimerBold : "optimer_bold.typeface.json",
}
async function loadFont() {
  const loader = new FontLoader();
  const font = await loader.loadAsync(`/fonts/${fonts.helvetikerBold}`);

  const textGeo = new TextGeometry('Hello Three.js', {
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
  textGeo.center();
  const material1 = new THREE.MeshMatcapMaterial({ matcap: matcapTexture1 });
  const material2 = new THREE.MeshMatcapMaterial({ matcap: matcapTexture2 });

  const textMesh = new THREE.Mesh(textGeo, material1)
  groupMain.add(textMesh)


  const boxGeo = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
  const torusGeo = new THREE.TorusGeometry(0.5, 0.3, 15, 15);
  const triangelGeo = new THREE.TetrahedronGeometry();

  let finalGeometry = boxGeo;
  
  for (let index = 0; index < 100; index++) {
    const randNum = Math.random();
    if( randNum > 0.5){
      finalGeometry = boxGeo;
    }else{
      finalGeometry = triangelGeo;
    }
    const particleMesh = new THREE.Mesh(finalGeometry, material1);
    particleMesh.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
    )

    particleMesh.rotation.x = Math.random() * Math.PI
    particleMesh.rotation.y = Math.random() * Math.PI

    const scale = Math.random() + 0.2
    particleMesh.scale.set(scale, scale, scale)

    groupChild.add(particleMesh)

  }
}

// Load text
loadFont();

//lights
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