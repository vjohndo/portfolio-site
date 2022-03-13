import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
// const gui = new dat.GUI()

const parameters = {
    meshColor: '#FF8A72',
    particleColor: '#FF8A72'
}

// gui
//     .addColor(parameters, 'materialColor')
//     .onChange(() => {
//         material.color.set(parameters.materialColor)
//         particles.color.set(parameters.materialColor)
//     })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/5.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshToonMaterial({
    color: parameters.meshColor,
    gradientMap: gradientTexture
})

// Meshes

const mesh1 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.7, 0.2, 100, 16),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.ConeGeometry(0.8, 1.6, 32),
    material
)
const mesh4 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.6, 0.1),
    material
)
const mesh5 = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.2, 8, 30),
    material
)

// Positions
const objectsDistance = 4
mesh1.position.y = -objectsDistance * 0
mesh2.position.y = -objectsDistance * 1
mesh3.position.y = -objectsDistance * 2
mesh4.position.y = -objectsDistance * 3
mesh5.position.y = -objectsDistance * 4

let objectsOffset = 1.75
mesh1.position.x = objectsOffset
mesh2.position.x = -objectsOffset
mesh3.position.x = objectsOffset
mesh4.position.x = -objectsOffset
mesh5.position.x = objectsOffset

const objectsGroup = new THREE.Group()
objectsGroup.add(mesh1, mesh2, mesh3, mesh4, mesh5)
scene.add(objectsGroup)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()




/**
 * Particles
 */
// Geometry
const particlesCount = 400
const positions = new Float32Array(particlesCount*3)

for(let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.4 - Math.random() * objectsDistance * 5
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.particleColor,
    sizeAttenuation: true,
    size: 0.05
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// Permanent Rotation
const sectionMeshes = [mesh1, mesh2, mesh3, mesh4, mesh5]

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0 

window.addEventListener('scroll', () => 
{
    scrollY = window.scrollY
    let newSection = Math.round(scrollY / sizes.height)
    if (sizes.height > sizes.width) {
        newSection = Math.round(newSection / 0.775)
    }
    
    if (newSection != currentSection) 
    {
        currentSection = newSection
        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=6',
                z: '+=1.5'
            }
        )
    }
})

/**
 * Cursor / Mouse
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

// const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => 
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5

    mouse.x = cursor.x * 2
    mouse.y = - cursor.x * 2
})



/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
let previousScalePortrait = false

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    
    if (sizes.height > sizes.width) {
        if (previousScalePortrait === false) {
            previousScalePortrait = true
            sectionMeshes.forEach( (mesh) => {
                mesh.scale.set(0.5, 0.5, 0.5)
            })
            let objectsOffset = 1.5 * (sizes.width/sizes.height)
            mesh1.position.x = objectsOffset
            mesh2.position.x = -objectsOffset*0.8
            mesh3.position.x = objectsOffset
            mesh4.position.x = -objectsOffset*0.6
            mesh5.position.x = objectsOffset*0.8

            let objectsDistance = 4*0.775
            mesh1.position.y = -objectsDistance * 0 + 0.5 
            mesh2.position.y = -objectsDistance * 1 + 0.2
            mesh3.position.y = -objectsDistance * 2
            mesh4.position.y = -objectsDistance * 3
            mesh5.position.y = -objectsDistance * 4
        }
    } else {

        if (previousScalePortrait === true) {
            previousScalePortrait = false
            sectionMeshes.forEach( (mesh) => {
                mesh.scale.set(1, 1, 1)
            })
            let objectsOffset = 1.75
            mesh1.position.x = objectsOffset
            mesh2.position.x = -objectsOffset
            mesh3.position.x = objectsOffset
            mesh4.position.x = -objectsOffset
            mesh5.position.x = objectsOffset

            let objectsDistance = 4
            mesh1.position.y = -objectsDistance * 0
            mesh2.position.y = -objectsDistance * 1
            mesh3.position.y = -objectsDistance * 2
            mesh4.position.y = -objectsDistance * 3
            mesh5.position.y = -objectsDistance * 4
        }
    }

    // Animate camera based on the scroll
    camera.position.y = -scrollY / sizes.height * objectsDistance

    const parrallaxX = cursor.x * 0.5
    const parrallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parrallaxX - cameraGroup.position.x) * 2 * deltaTime
    cameraGroup.position.y += (parrallaxY - cameraGroup.position.y) * 2 * deltaTime

    // Animate meshes
    for (const mesh of sectionMeshes) 
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    // // Raycasting

    // raycaster.setFromCamera(mouse, camera)
    // const intersect = raycaster.intersectObject(sectionMeshes)
    // intersect.object.material.color.set('#0000ff')

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()