import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import testVertexShader from './shaders/raging-sea/vertex.vert'
import testFragmentShader from './shaders/raging-sea/fragment.frag'

// console.log(testVertexShader);

const gui = new GUI({ width: 340 });
const debugObject = {};
// Colors
debugObject.depthColor = '#23a6d1'
debugObject.surfaceColor = '#aceefb'

gui.addColor(debugObject, 'depthColor').onChange(() => { 
    material.uniforms.uDepthColor.value.set(debugObject.depthColor) 
})
gui.addColor(debugObject, 'surfaceColor').onChange(() => { 
    material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) 
})

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//mesh setup
// Geometry
const geometry = new THREE.PlaneGeometry(2, 2, 512, 512);



// Material
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
        uBigWavesElevation:{
            value: 0.121
        },
        uBigWavesFrequency: { 
            value: new THREE.Vector2(7.316, 3.372) 
        },
        uTime: {
            value : 0
        },
        uBigWavesSpeed: { 
            value: 0.75 
        },
        uDepthColor: { 
            value: new THREE.Color(debugObject.depthColor) 
        },
        uSurfaceColor: { 
            value: new THREE.Color(debugObject.surfaceColor) 
        },
         uColorOffset: { 
            value: 0.15
        },
        uColorMultiplier: { 
            value: 3.21
        },
        uSmallWavesElevation: { 
            value: 0.15 
        },
        uSmallWavesFrequency: { 
            value: 3 
        },
        uSmallWavesSpeed: { 
            value: 0.2 
        },
        uSmallIterations: { 
            value: 4 
        },
    }
   
});

gui.add(material.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation');
gui.add(material.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
gui.add(material.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
gui.add(material.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')
gui.add(material.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(material.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')
gui.add(material.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
gui.add(material.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
gui.add(material.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
gui.add(material.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('uSmallIterations')
// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = - Math.PI * 0.5;
scene.add(mesh);

console.log(material);


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