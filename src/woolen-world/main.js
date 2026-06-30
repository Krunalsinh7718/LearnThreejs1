import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from "gsap";
import GUI from "lil-gui";


import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { blenderToThree } from "../common/utilityFunctions.js";
import { getMeshesByName } from "../common/utilityFunctions.js";



/*=============================================
=            GUI setup            =
=============================================*/
const gui = new GUI();

//loader
const textureLoader = new THREE.TextureLoader();

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(13.6, 0.30, 20); // Move the camera up and back
// camera.lookAt(0, 0, 0);
gui.add(camera.position, 'x').min(-20).max(20).step(0.1).name("camera x");
gui.add(camera.position, 'y').min(-20).max(20).step(0.1).name("camera y");
gui.add(camera.position, 'z').min(-20).max(20).step(0.1).name("camera z");

//skybox
textureLoader.load(
    '/images/environment-maps/woolen-world/map2.png',
    (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.mapping =
            THREE.EquirectangularReflectionMapping;

        scene.background = texture;
        scene.environment = texture;
    }
);

/*=============================================
=            Models            =
=============================================*/
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/loaders/draco/')
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader)
// let mixer = null
let woolenWorldModel = null;
gltfLoader.load("/models/woolen/woolen-world-2.glb",
  (gltf) => {
    woolenWorldModel = gltf.scene;
    // console.log(gltf);
    // woolenWorldModel.scale.set(0.25, 0.25, 0.25)
     woolenWorldModel.rotation.x = 0.0800;
        woolenWorldModel.rotation.y = -0.98;
    // mixer = new THREE.AnimationMixer(woolenWorldModel)
    // const action = mixer.clipAction(gltf.animations[2])
    // action.play()
    scene.add(woolenWorldModel)


    gui.add(woolenWorldModel.rotation, 'x').min(-6.28).max(6.28).step(0.1);
    gui.add(woolenWorldModel.rotation, 'y').min(-6.28).max(6.28).step(0.1);
    gui.add(woolenWorldModel.rotation, 'z').min(-6.28).max(6.28).step(0.1);
  },
  (progress) => {
    console.log('progress')
    // console.log(progress)
  },
  (error) => {
    console.log('error')
    console.log(error)
  }
)

//path

const array = [{'co': [16.500953674316406, 5.198814392089844, -37.1585693359375], 'handle_left': [18.86478614807129, 0.09969902038574219, -35.412391662597656], 'handle_right': [15.218029975891113, 7.966259956359863, -38.10627365112305]}, {'co': [9.933996200561523, 13.287545204162598, -37.40262222290039], 'handle_left': [13.483694076538086, 11.340575218200684, -38.391761779785156], 'handle_right': [8.601469993591309, 14.018421173095703, -37.031307220458984]}, {'co': [0.4333368241786957, 17.439693450927734, -42.2048454284668], 'handle_left': [6.01943302154541, 17.93297004699707, -42.411155700683594], 'handle_right': [-3.9848551750183105, 17.04954719543457, -42.04166793823242]}, {'co': [-9.954635620117188, 15.10968017578125, -36.85601806640625], 'handle_left': [-8.450104713439941, 14.993548393249512, -37.2690315246582], 'handle_right': [-12.963696479797363, 15.341943740844727, -36.029991149902344]}, {'co': [-24.424575805664062, 9.067371368408203, -31.711456298828125], 'handle_left': [-21.582670211791992, 11.304232597351074, -32.544273376464844], 'handle_right': [-27.266481399536133, 6.830510139465332, -30.878639221191406]}, {'co': [-31.473358154296875, -7.287506580352783, -25.059843063354492], 'handle_left': [-31.14728546142578, -3.9118356704711914, -26.567188262939453], 'handle_right': [-32.145729064941406, -14.24824333190918, -21.951650619506836]}, {'co': [-39.19305419921875, -7.376869201660156, -9.619207382202148], 'handle_left': [-38.54468536376953, -8.980756759643555, -11.339138984680176], 'handle_right': [-39.84142303466797, -5.772981643676758, -7.899275779724121]}, {'co': [-41.16273498535156, -0.8250389099121094, -1.573021411895752], 'handle_left': [-41.590702056884766, -2.545459270477295, -3.2487306594848633], 'handle_right': [-39.47874450683594, 5.944570064544678, 5.020655632019043]}, {'co': [-33.548797607421875, 8.469772338867188, 21.948394775390625], 'handle_left': [-39.37616729736328, 7.3193159103393555, 14.337061882019043], 'handle_right': [-32.82452392578125, 8.612760543823242, 22.894393920898438]}, {'co': [-26.579132080078125, -1.3330917358398438, 31.329530715942383], 'handle_left': [-27.029550552368164, -1.4024072885513306, 30.74077033996582], 'handle_right': [-26.128713607788086, -1.263776183128357, 31.918291091918945]}, {'co': [-13.530895233154297, -4.836589813232422, 38.31865692138672], 'handle_left': [-15.880406379699707, -3.940031051635742, 37.1994743347168], 'handle_right': [-11.181384086608887, -5.733148574829102, 39.43783950805664]}, {'co': [-7.208621978759766, -9.934089660644531, 38.7462158203125], 'handle_left': [-9.194579124450684, -8.090224266052246, 38.676544189453125], 'handle_right': [-3.105368137359619, -13.743762969970703, 38.890167236328125]}, {'co': [9.388216018676758, -8.800949096679688, 38.74122619628906], 'handle_left': [4.545106887817383, -11.540334701538086, 39.38237380981445], 'handle_right': [16.573963165283203, -4.736507892608643, 37.78995132446289]}, {'co': [31.00189781188965, 0.09194350242614746, 28.927854537963867], 'handle_left': [25.95672035217285, -1.1970813274383545, 35.40428924560547], 'handle_right': [36.04707336425781, 1.3809678554534912, 22.4514217376709]}, {'co': [36.885826110839844, -1.2323760986328125, 17.75188446044922], 'handle_left': [35.551856994628906, 3.0307435989379883, 20.19011688232422], 'handle_right': [38.21979522705078, -5.4954962730407715, 15.313652038574219]}, {'co': [40.63861846923828, -2.4444046020507812, 3.462714195251465], 'handle_left': [41.55558776855469, -3.3112001419067383, 8.392873764038086], 'handle_right': [39.721649169921875, -1.5776090621948242, -1.4674453735351562]}, {'co': [41.231449127197266, -0.3251835107803345, -4.803958415985107], 'handle_left': [41.384193420410156, -2.1770553588867188, -2.928107976913452], 'handle_right': [40.97193145751953, 2.821200370788574, -7.991082668304443]}, {'co': [38.83897399902344, -3.9221725463867188, -12.480058670043945], 'handle_left': [39.95368957519531, 1.4261159896850586, -10.040729522705078], 'handle_right': [37.38135528564453, -10.915666580200195, -15.669757843017578]}, {'co': [27.481861114501953, 0.6248087882995605, -30.297815322875977], 'handle_left': [31.25588607788086, -0.9436012506484985, -26.552907943725586], 'handle_right': [25.275466918945312, 1.5417425632476807, -32.487186431884766]}];
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
curveObject.visible = true;
scene.add(curveObject);

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Ambient Light (soft overall light)
const ambient = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambient);

// Directional Light (like sunlight)
const dirLight = new THREE.DirectionalLight(0xffffff, 4);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

//point light
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

// Light helper (to visualize the light)
const helper = new THREE.DirectionalLightHelper(dirLight, 1);
// scene.add(helper);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.dampingFactor = 0.05;

//animation loop
function animate() {
    if(woolenWorldModel){
        woolenWorldModel.rotation.z -= 0.002;
        
    }
    controls.update();

    renderer.render(scene, camera);
}

//handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});