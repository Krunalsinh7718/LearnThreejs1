import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui';
import vertexShader from "./vertex.vert";
import fragmentShader from "./fragment.frag";


const createFirework = (count, position, size, texture, radius, color) => {
    //geometry
    const positionsArr = new Float32Array(count * 3);
    const sizesArray = new Float32Array(count)

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;

         const spherical = new THREE.Spherical(
             radius * (0.75 + Math.random() * 0.25),
            Math.random() * Math.PI,
            Math.random() * Math.PI * 2
        )
        const position = new THREE.Vector3()
        position.setFromSpherical(spherical)

        positionsArr[i3] = position.x;
        positionsArr[i3 + 1] = position.y;
        positionsArr[i3 + 2] = position.z;

         sizesArray[i] = Math.random()
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positionsArr, 3))
     geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizesArray, 1))

    //material
     texture.flipY = false
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            uSize: new THREE.Uniform(size),
            uResolution: new THREE.Uniform(sizes.resolution),
             uTexture: new THREE.Uniform(texture),
              uColor: new THREE.Uniform(color)
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    //mesh
    const mesh = new THREE.Points(geometry, material);
    mesh.position.copy(position);
    scene.add(mesh)

    // Test
    // const test = new THREE.Mesh(
    //     new THREE.PlaneGeometry(),
    //     new THREE.MeshBasicMaterial()
    // )
    // scene.add(test)
}



const gui = new GUI({ width: 350 });

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
     uProgress: new THREE.Uniform(0)
}
sizes.resolution = new THREE.Vector2(sizes.width, sizes.height);

//scene setup
const scene = new THREE.Scene();



/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const textures = [
    textureLoader.load("/images/star-particle-alpha/11.png")
];


//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

//renderer setup
const rendererParameters = {}
rendererParameters.clearColor = '#1d1f2a'

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(rendererParameters.clearColor)
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

gui
    .addColor(rendererParameters, 'clearColor')
    .onChange(() => {
        renderer.setClearColor(rendererParameters.clearColor)
    })

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
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    sizes.resolution.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio )

});


//handle click event
window.addEventListener('click', () => {
    createFirework(100, new THREE.Vector3(), 0.5, textures[0], 1, new THREE.Color('#8affff'));
});

