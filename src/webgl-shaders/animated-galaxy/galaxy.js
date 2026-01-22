import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import testVertexShader from './vertex.vert'
import testFragmentShader from './fragment.frag'

const gui = new GUI({width: 350});

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//scene setup
const scene = new THREE.Scene();

//generate galaxy
const parameters = {};
parameters.count = 50000;
parameters.radius = 3.4;
parameters.branches = 3;
parameters.randomness = 0.5;
parameters.spin = 2;
parameters.randomnessPower = 4.1;
parameters.size = 0.01;
parameters.insideColor = "#ff6030";
parameters.outsideColor = "#1b3984";

let geometry = null;
let material = null;
let points = null;


const generateGalaxy = () => {

    if(points !== null){
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }
    //geometry
    geometry = new THREE.BufferGeometry();

    let positions = new Float32Array(parameters.count * 3);
    let colors = new Float32Array(parameters.count * 3);

    let colorInside = new THREE.Color(parameters.insideColor);
    let colorOutside = new THREE.Color(parameters.outsideColor);

    
    for (let index = 0; index < parameters.count; index++) {
        const i3 = index * 3;
        
        
        let branchAngle = (index % parameters.branches) / parameters.branches * Math.PI * 2;
        const randRadius = parameters.radius * Math.random();
        const spinAngle = parameters.spin * randRadius
        // position
        if(index < 20){
                console.log(randRadius, randRadius / parameters.radius);
            }
            
            const randomnessX = Math.pow(Math.random() , parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
            const randomnessY = Math.pow(Math.random() , parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
            const randomnessZ = Math.pow(Math.random() , parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
            
            positions[i3] =  Math.cos(branchAngle + spinAngle) * randRadius + randomnessX;
            positions[i3 + 1] = randomnessY;
            positions[i3 + 2] =  Math.sin(branchAngle + spinAngle) * randRadius + randomnessZ;
            
        //color
        const mixColor = colorInside.clone();
        mixColor.lerp(colorOutside, randRadius / parameters.radius);

        colors[i3] =  mixColor.r;
        colors[i3 + 1] = mixColor.g;
        colors[i3 + 2] = mixColor.b;
        
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
        size : parameters.size,
        sizeAttenuation : true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
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
gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);
generateGalaxy();

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(3, 3, 3)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();
//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();

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



// const parameters = {};
// parameters.count = 1000;
// parameters.size = 0.02;
// parameters.radius = 5;
// parameters.branches = 3;
// parameters.spin = 3;
// parameters.randomness = 0.2;

// let geomatry = null;
// let material = null;
// let points = null;

// const generateGalaxy = () => {

//     //distroy old galaxy
//     if(points !== null){
//         geomatry.dispose();
//         material.dispose();
//         scene.remove(points);
//     }

//     //geomatry
//     geomatry = new THREE.BufferGeometry();
//     const positions = new Float32Array(parameters.count * 3);
    
//     for (let index = 0; index < parameters.count; index++) {
//         const i3 = index * 3;

//         const radius = Math.random() * parameters.radius;
//         const spinAngle = radius * parameters.spin;
//         const branchAngle = (index % parameters.branches) / parameters.branches * Math.PI * 2;

//         const randomX = Math.random() * parameters.randomness;
//         const randomY = Math.random() * parameters.randomness;
//         const randomZ = Math.random() * parameters.randomness;

//         if(index < 20){
//             console.log(index, branchAngle);
            
//         }

//         positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;    
//         positions[i3 + 1] = randomY;    
//         positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;    
//     }  

//     geomatry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

//     //material
//     material = new THREE.PointsMaterial({
//         size : parameters.size,
//         sizeAttenuation : true,
//         depthWrite: false,
//         blending: THREE.AdditiveBlending
//     })

//     //points
//     points = new THREE.Points(geomatry, material);
//     scene.add(points);
// } 

// gui.add(parameters, "count").min(100).max(100000).step(100).onFinishChange(generateGalaxy);
// gui.add(parameters, "size").min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
// gui.add(parameters, "radius").min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
// gui.add(parameters, "branches").min(1).max(20).step(1).onFinishChange(generateGalaxy);
// gui.add(parameters, "spin").min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
// gui.add(parameters, "randomness").min(0).max(2).step(0.001).onFinishChange(generateGalaxy);


// generateGalaxy();