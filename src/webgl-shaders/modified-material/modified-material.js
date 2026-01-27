import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui'

const gui = new GUI({ width: 350 });

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//scene setup
const scene = new THREE.Scene();

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = 1
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/images/environment-maps/7/px.jpg',
    '/images/environment-maps/7/nx.jpg',
    '/images/environment-maps/7/py.jpg',
    '/images/environment-maps/7/ny.jpg',
    '/images/environment-maps/7/pz.jpg',
    '/images/environment-maps/7/nz.jpg'
])
scene.background = environmentMap
scene.environment = environmentMap

/**
 * Material
 */

// Textures
const mapTexture = textureLoader.load('/models/LeePerrySmith/color.jpg')
mapTexture.colorSpace = THREE.SRGBColorSpace
const normalTexture = textureLoader.load('/models/LeePerrySmith/normal.jpg')

// Material
const material = new THREE.MeshStandardMaterial({
    map: mapTexture,
    normalMap: normalTexture
})

const material1 = new THREE.MeshStandardMaterial();

const depthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking
})

const customUniforms = {
    uTime: { value: 0 }
}

const updateShader = (shader, isNormalMaterial = false, rotate = false) => {
    shader.uniforms.uTime = customUniforms.uTime;
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
            #include <common>

            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }

            mat2 scale(vec2 _scale){
                return mat2(_scale.x,0.0,
                            0.0,_scale.y);
            }
                
        `
    )


    let rotationMatrix = `
    float angle = (
    cos(position.y - uTime) 
    ) * 0.1 + 0.2;
    mat2 rotateMatrix = scale(vec2(abs(angle * 5.0)));
    `
    if(rotate){
        rotationMatrix = `
    float angle = (
    cos(position.y - uTime) 
    ) * 2.9;
    mat2 rotateMatrix = get2dRotateMatrix(angle);
    `
    }
    if (isNormalMaterial) {

        shader.vertexShader = shader.vertexShader.replace(
            '#include <beginnormal_vertex>',
            `
              #include <beginnormal_vertex>
    
                ${rotationMatrix}
    
                objectNormal.xz = rotateMatrix * objectNormal.xz;
              `
        )
    }
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
            #include <begin_vertex>

            ${!isNormalMaterial ? rotationMatrix : ''}

            transformed.xz = rotateMatrix * transformed.xz;
        `
    )
}

material.onBeforeCompile = (shader) => {
    updateShader(shader, true);
}


depthMaterial.onBeforeCompile = (shader) => {
    updateShader(shader, false);
}

/**
 * Models
 */
gltfLoader.load(
    '/models/LeePerrySmith/LeePerrySmith.glb',
    (gltf) => {
        // Model
        const mesh = gltf.scene.children[0]
        mesh.rotation.y = Math.PI * 0.5
        mesh.material = material;
        mesh.customDepthMaterial = depthMaterial; // Update the depth material
        scene.add(mesh)

        // Update materials
        updateAllMaterials()
    }
)


gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        console.log(gltf.scene);

        gltf.scene.position.set(0, -2, -10);
        gltf.scene.scale.set(10, 10, 10);
        gltf.scene.rotation.set(0, 2, 0);
        gltf.scene.children.forEach(
            children => {
                children.material.onBeforeCompile = (shader) => {
                    updateShader(shader, true, true);
                }
            }
        )
        scene.add(gltf.scene)
    }
)

/**
 * Plane
 */
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 15, 15),
    new THREE.MeshStandardMaterial()
)
plane.rotation.y = Math.PI
plane.position.y = - 5
plane.position.z = 5
scene.add(plane)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, - 2.25)
scene.add(directionalLight)


//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

    customUniforms.uTime.value = elapsedTime;

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

