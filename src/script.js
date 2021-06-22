
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui'
import { WireframeGeometry } from 'three'
// import gsap from 'gsap'
// import { LinearFilter, Mesh } from 'three'

const debugObject = {}

const gui = new dat.GUI()

const canvas = document.querySelector('canvas.webgl')


const scene = new THREE.Scene()

const gltfLoader = new GLTFLoader()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let brush = null

gltfLoader.load(
    '/models/teeth/scene.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(20, 15, 15)
        const mesh = new THREE.Mesh( geometry, material );
        gltf.scene.position.y = 17
        gltf.scene.position.z = -5
        gltf.scene.rotation.x = -0.1
        scene.add(gltf.scene)
    }
)

gltfLoader.load(
    'models/toothbrush/scene.gltf',
    (gltf) =>
    {
        brush = gltf
        gltf.scene.scale.set(0.13, 0.13, 0.13)
        const mesh = new THREE.Mesh( geometry, material)
        gltf.scene.rotation.x = -1.5
        gltf.scene.rotation.y = 1.6
        gltf.scene.position.z = 13.5
        gltf.scene.position.y = -0.5
        gltf.scene.position.x = 17
        scene.add(gltf.scene)
    }
)


const geometry = new THREE.CircleGeometry (1, 32 );
const material = new THREE.MeshBasicMaterial( { color: '#121C24' } )
const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.PointLight(0xffffff, 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 100
directionalLight.shadow.camera.left = -10
directionalLight.shadow.camera.top = 10
directionalLight.shadow.camera.right = 10
directionalLight.shadow.camera.bottom = -10
directionalLight.position.set(-20, 30, 25)
scene.add(directionalLight)

debugObject.clearColor = '#121C24'
renderer.setClearColor(debugObject.clearColor)

const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1)
camera.position.set(0, 0, 30)
scene.add(camera)


const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 1, 0)
controls.enableDamping = true


const clock = new THREE.Clock()
let previousTime = 0

// gsap.to(mesh.position, { duration: 1, delay: 1, x:2 })

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if (brush) {
        brush.scene.position.x -= 0.1;
        if (brush.scene.position.x < 14){
            brush.scene.position.x = 17
            brush.scene.position.y = Math.round(Math.random() * 4) - 4
        }
    }

    // brush.position.x = Math.sin(elapsedTime)

    controls.update()
    
    renderer.render(scene, camera)
    
    window.requestAnimationFrame(tick)
}

tick()
