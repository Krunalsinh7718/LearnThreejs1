import * as THREE from "three";


/*=============================================
=            common variables            =
=============================================*/
const parameters = {
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight 
}

/*=============================================
=            Scene setup            =
=============================================*/
const scene = new THREE.Scene();


/*=============================================
=            Camera setup            =
=============================================*/
const camera = new THREE.PerspectiveCamera(35, parameters.canvasWidth / parameters.canvasHeight, 0.01, 1000);
camera.position.z = 6
scene.add(camera)


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
const mesh1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: "red"})
)
mesh1.scale.set(0.5, 0.5, 0.5)

const mesh2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: "green"})
)
mesh2.scale.set(0.5, 0.5, 0.5)

const mesh3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: "blue"})
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

/*=============================================
=            animation loop            =
=============================================*/
function animation(){
    camera.position.y = -scrollY / parameters.canvasHeight * objectDistance;
    
    renderer.render(scene, camera)
}


/*=============================================
=            Events setup            =
=============================================*/
window.addEventListener('resize', e => {
    parameters.canvasWidth = window.innerWidth;
    parameters.canvasHeight = window.innerHeight;
    renderer.setSize(parameters.canvasWidth, parameters.canvasHeight)

    camera.aspect = parameters.canvasWidth / parameters.canvasHeight;
    camera.updateProjectionMatrix();
})

let scrollY = window.scrollY;
window.addEventListener('scroll', e => {
    scrollY = window.scrollY;
    console.log(scrollY);
    
})

















