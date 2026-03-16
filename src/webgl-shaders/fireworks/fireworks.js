import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Sky } from 'three/addons/objects/Sky.js'
import GUI from 'lil-gui';
import { gsap } from "gsap";
import vertexShader from "./vertex.vert";
import fragmentShader from "./fragment.frag";






const gui = new GUI({ width: 350 });

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    uProgress: new THREE.Uniform(0)
}
sizes.resolution = new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);

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
renderer.setPixelRatio(sizes.pixelRatio);
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

//sky
const sky = new Sky()
sky.scale.setScalar(450000)
scene.add(sky)

const sun = new THREE.Vector3()

const skyParameters = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.95,
    elevation: -2.2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
}

const updateSky = () =>
{
    const uniforms = sky.material.uniforms
    uniforms['turbidity'].value = skyParameters.turbidity
    uniforms['rayleigh'].value = skyParameters.rayleigh
    uniforms['mieCoefficient'].value = skyParameters.mieCoefficient
    uniforms['mieDirectionalG'].value = skyParameters.mieDirectionalG

    const phi = THREE.MathUtils.degToRad(90 - skyParameters.elevation)
    const theta = THREE.MathUtils.degToRad(skyParameters.azimuth)

    sun.setFromSphericalCoords(1, phi, theta)

    uniforms['sunPosition'].value.copy(sun)

    renderer.toneMappingExposure = skyParameters.exposure
    renderer.render(scene, camera)
}

gui.add(skyParameters, 'turbidity', 0.0, 20.0, 0.1).onChange(updateSky)
gui.add(skyParameters, 'rayleigh', 0.0, 4, 0.001).onChange(updateSky)
gui.add(skyParameters, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(updateSky)
gui.add(skyParameters, 'mieDirectionalG', 0.0, 1, 0.001).onChange(updateSky)
gui.add(skyParameters, 'elevation', 0, 90, 0.1).onChange(updateSky)
gui.add(skyParameters, 'azimuth', - 180, 180, 0.1).onChange(updateSky)
gui.add(skyParameters, 'exposure', 0, 1, 0.0001).onChange(updateSky)

updateSky()


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
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
    sizes.resolution.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)

});

const createFirework = (count, position, size, texture, radius, color) => {
    //geometry
    const positionsArr = new Float32Array(count * 3);
    const sizesArray = new Float32Array(count);
    const timeMultipliersArray = new Float32Array(count);

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

        sizesArray[i] = Math.random();

        timeMultipliersArray[i] = 1 + Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positionsArr, 3))
    geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizesArray, 1))
    geometry.setAttribute('aTimeMultiplier', new THREE.Float32BufferAttribute(timeMultipliersArray, 1))

    //material
    texture.flipY = false
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            uSize: new THREE.Uniform(size),
            uResolution: new THREE.Uniform(sizes.resolution),
            uTexture: new THREE.Uniform(texture),
            uColor: new THREE.Uniform(color),
            uProgress: new THREE.Uniform(0)
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    //mesh
    const fireworks = new THREE.Points(geometry, material);
    fireworks.position.copy(position);
    scene.add(fireworks)

    // Test
    // const test = new THREE.Mesh(
    //     new THREE.PlaneGeometry(),
    //     new THREE.MeshBasicMaterial()
    // )
    // scene.add(test)

    //destroy
    const destroy = () => {

        // console.log("distroy");
        scene.remove(fireworks);
        geometry.dispose();
        material.dispose();

    }

    //animate
    gsap.to(material.uniforms.uProgress, {
        value: 1, duration: 3, ease: "linear", onComplete: destroy
    })
}

const createRandomFirework = () => {
    const count = Math.round(Math.random() * 1000 + 400);
    const position = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random(),
        (Math.random() - 0.5) * 2
    )
    const size = 0.1 + Math.random() * 0.1;
    const texture = textures[0];
    const radius = Math.random() * 2 + 0.5;
    const color = new THREE.Color();
    color.setHSL(Math.random(), 1, 0.7);

    createFirework(
        count,                          //count
        position,          //position
        size,                          //size
        texture,                  //texture
        radius,                            //radius
        color  //color
    );
}
//handle click event
createRandomFirework();
window.addEventListener('click', () => {

    createRandomFirework();
});




