import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import testVertexShader from './vertex.vert'
import testFragmentShader from './fragment.frag'

const gui = new GUI({ width: 350 });

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//scene setup
const scene = new THREE.Scene();

//generate galaxy
const parameters = {};
parameters.count = 200000;
parameters.size = 0.005;
parameters.radius = 5;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomness = 0.2;
parameters.randomnessPower = 3;
parameters.safeRadius = 0.1;
parameters.insideColor = "#ff6030";
parameters.outsideColor = "#1b3984";

let geometry = null;
let material = null;
let points = null;


const generateGalaxy = () => {

    if (points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }
    //geometry
    geometry = new THREE.BufferGeometry();

    let positions = new Float32Array(parameters.count * 3);
    let randomness = new Float32Array(parameters.count * 3);
    let colors = new Float32Array(parameters.count * 3);
    let scales = new Float32Array(parameters.count * 1);

    let colorInside = new THREE.Color(parameters.insideColor);
    let colorOutside = new THREE.Color(parameters.outsideColor);


    for (let index = 0; index < parameters.count; index++) {
        const i3 = index * 3;


        let branchAngle = (index % parameters.branches) / parameters.branches * Math.PI * 2;
        const randRadius = parameters.radius * Math.random();
        const radiusRatio = randRadius / parameters.radius;
        const spinAngle = parameters.spin * randRadius;
        // const safeRadius = Math.max(radiusRatio, parameters.safeRadius); // prevents explosion
        // const randomFactor = Math.pow(1.3 - radiusRatio, parameters.randomnessPower) * parameters.randomness;

        // position
        // if (index < 20) {
        //     console.log(randRadius, randRadius / parameters.radius);
        // }

        
        positions[i3] = Math.cos(branchAngle) * randRadius;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = Math.sin(branchAngle) * randRadius;
        
        //color
        const mixColor = colorInside.clone();
        mixColor.lerp(colorOutside, randRadius / parameters.radius);
        
        colors[i3] = mixColor.r;
        colors[i3 + 1] = mixColor.g;
        colors[i3 + 2] = mixColor.b;

        //rendomness
        const randomnessX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * randRadius;
        const randomnessY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * randRadius;
        const randomnessZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * randRadius;

        randomness[i3    ] = randomnessX;
        randomness[i3 + 1] = randomnessY;
        randomness[i3 + 2] = randomnessZ;

        //sacale
        scales[index] = Math.random();

    }
    
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute("aRandomness", new THREE.BufferAttribute(randomness, 3));

    material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
        uniforms: {
            uSize: {
                value : 30 * renderer.getPixelRatio()
            },
            uTime: {
                value : 0
            }
        }
    })

    points = new THREE.Points(geometry, material);
    scene.add(points);

}

gui.add(parameters, "count").min(1000).max(100000).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, "size").min(0.005).max(0.05).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, "branches").min(1).max(10).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, "radius").min(2).max(6).step(0.1).onFinishChange(generateGalaxy);
gui.add(parameters, "spin").min(-10).max(10).step(0.1).onFinishChange(generateGalaxy);
gui.add(parameters, "randomness").min(0.01).max(0.8).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, "randomnessPower").min(1).max(5).step(0.1).onFinishChange(generateGalaxy);
gui.add(parameters, "safeRadius").min(0.05).max(0.5).step(0.001).onFinishChange(generateGalaxy);
gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(3, 3, 3)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//call generate galaxy
generateGalaxy();

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();
//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();

    // console.log(material.uniforms.uTime.value);
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

