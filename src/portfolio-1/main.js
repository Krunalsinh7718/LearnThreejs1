import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";


/*=============================================
=            common variables            =
=============================================*/
const parameters = {
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight,
    color: "#90da8b"
}

/*=============================================
=            GUI setup            =
=============================================*/
const gui = new GUI();

/*=============================================
=            texture setup            =
=============================================*/
const textureLoader = new THREE.TextureLoader();

const texture1 = textureLoader.load("./gradients/3.jpg");
texture1.magFilter = THREE.NearestFilter;

/*=============================================
=            Scene setup            =
=============================================*/
const scene = new THREE.Scene();


/*=============================================
=            Camera setup            =
=============================================*/
const cameraGroup = new THREE.Group();
const camera = new THREE.PerspectiveCamera(35, parameters.canvasWidth / parameters.canvasHeight, 0.01, 1000);
camera.position.z = 6
cameraGroup.add(camera)
scene.add(cameraGroup)


/*=============================================
=            renderer setup            =
=============================================*/
const renderer = new THREE.WebGLRenderer();
renderer.domElement.classList.add('webgl')
renderer.setSize(parameters.canvasWidth, parameters.canvasHeight)
renderer.setAnimationLoop(animation)
renderer.setClearAlpha(0);
document.body.appendChild(renderer.domElement)



/*=============================================
=            Mesh            =
=============================================*/
const objectDistance = 4;
const objectDistanceX = 2;

const material = new THREE.MeshToonMaterial({
    gradientMap: texture1,
    color: parameters.color
});

gui.addColor(parameters, "color").onChange(e => {
    material.color.set(parameters.color)
})

const mesh1 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.7, 0.3, 100, 150),
    material
)
mesh1.scale.set(0.5, 0.5, 0.5)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 60, 60, false),
    material
)
mesh2.scale.set(0.5, 0.5, 0.5)

const mesh3 = new THREE.Mesh(
    new THREE.TorusGeometry(0.7, 0.3, 100, 150),
    material
)
mesh3.scale.set(0.5, 0.5, 0.5)

mesh1.position.y = objectDistance * 0;
mesh2.position.y = objectDistance * -1;
mesh3.position.y = objectDistance * -2;

mesh1.position.x = objectDistanceX;
mesh2.position.x = -objectDistanceX;
mesh3.position.x = objectDistanceX;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];


const bufferGeometry = new THREE.BufferGeometry();
const counts = 200;
const positions = new Float32Array(counts * 3);

for (let i = 0; i < counts; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 10;
    positions[i3 + 1] = - Math.random() * (objectDistance * sectionMeshes.length) + 2;
    positions[i3 + 2] = (Math.random() - 0.5) * 10;
}

bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const pointsMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: parameters.color
})
const points = new THREE.Points(bufferGeometry, pointsMaterial);
scene.add(points)

/*=============================================
=            lights            =
=============================================*/
const directionLight = new THREE.DirectionalLight("#eee", 4);
directionLight.position.set(0, 1, 1)
scene.add(directionLight);

const lightCameraHelper = new THREE.DirectionalLightHelper(directionLight)
// scene.add(lightCameraHelper)

// gui.add(directionLight.position,"x").min(0).max(6).step(0.1)
// gui.add(directionLight.position,"y").min(0).max(6).step(0.1)
// gui.add(directionLight.position,"z").min(0).max(6).step(0.1)
// gui.add(directionLight,"intensity").min(0).max(6).step(0.1)

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

    // console.log(deltaTime);


    camera.position.y = -scrollY / parameters.canvasHeight * objectDistance;
    const parallaxX = mouse.x * 0.5;
    const parallaxY = -mouse.y * 0.5;
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

    for(const mesh of sectionMeshes){
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12

        // mesh.position.x = mesh.position.x - (mouse.x)
    }

    renderer.render(scene, camera)
}


/*=============================================
=            Events setup            =
=============================================*/
let mouse = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX / parameters.canvasWidth - 0.5;
    mouse.y = e.clientY / parameters.canvasHeight - 0.5;
    //    console.log(mouse);

})


window.addEventListener('resize', e => {
    parameters.canvasWidth = window.innerWidth;
    parameters.canvasHeight = window.innerHeight;
    renderer.setSize(parameters.canvasWidth, parameters.canvasHeight)

    camera.aspect = parameters.canvasWidth / parameters.canvasHeight;
    camera.updateProjectionMatrix();
})

let scrollY = window.scrollY;
let currentSection = 0;
window.addEventListener('scroll', e => {
    scrollY = window.scrollY;
    let newSection = Math.round(scrollY / parameters.canvasHeight);


    if (currentSection != newSection) {
        currentSection = newSection;
        gsap.to(sectionMeshes[currentSection].rotation, {
            x: '+=6',
            y: '+=3',
            z: '+=1.5',
            duration: 1.5
        })
    }

})

















