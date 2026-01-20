import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import testVertexShader from './vertex.vert'
import testFragmentShader from './fragment.frag'

// console.log(testVertexShader);

const gui = new GUI();

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//scene setup
const scene = new THREE.Scene();

//texture

const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load("/images/flag/India-flag.jpg");


//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, - 0.25, 1)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//mesh setup
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
const count = geometry.attributes.position.count;
const aRandom = new Float32Array(count);

for (let i = 0; i < count; i++) {
    aRandom[i] = Math.random();
}
geometry.setAttribute('aRandom', new THREE.BufferAttribute(aRandom, 1));



console.log(count);


// Material
const material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
        uTime : {
            value : 0
        },
        uFrequency: { 
            value: new THREE.Vector2(10,10) 
        },
        uTexture: {
            value: flagTexture
        }
    }
});

gui.add(material.uniforms.uFrequency.value, "x").min(0).max(20).step(0.01).name("vFrequency X");
gui.add(material.uniforms.uFrequency.value, "y").min(0).max(20).step(0.01).name("vFrequency Y");
// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh);
mesh.scale.y = 2 / 3

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();
//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();

    //update materials
    material.uniforms.uTime.value = elapsedTime;

    //update controls
    controls.update();

    //render
    renderer.render(scene, camera);
}

//handle window resize
window.addEventListener('resize', () => {

    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});