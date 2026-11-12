
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xece8e1);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(8, 7, 10);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

document.getElementById('scene').appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0xc9a77c })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Back wall
const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 10),
    new THREE.MeshStandardMaterial({ color: 0xf1e8dc })
);
backWall.position.set(0, 5, -10);
scene.add(backWall);

// Left wall
const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 10),
    new THREE.MeshStandardMaterial({ color: 0xe6d9c8 })
);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-10, 5, 0);
scene.add(leftWall);

// Right wall
const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 10),
    new THREE.MeshStandardMaterial({ color: 0xe6d9c8 })
);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(10, 5, 0);
scene.add(rightWall);


// WINDOW

const windowFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b725b
});

const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0x9dcbdc,
    transparent: true,
    opacity: 0.5,
    metalness: 0.1,
    roughness: 0.2
});

// Window glass
const windowGlass = new THREE.Mesh(
    new THREE.BoxGeometry(3.8, 2.8, 0.12),
    glassMaterial
);
windowGlass.position.set(4, 5.5, -9.85);
scene.add(windowGlass);

// Window frame - left and right
for (let x of [2.05, 5.95]) {
    const frame = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 3.1, 0.2),
        windowFrameMaterial
    );
    frame.position.set(x, 5.5, -9.7);
    scene.add(frame);
}

// Window frame - top and bottom
for (let y of [4, 7]) {
    const frame = new THREE.Mesh(
        new THREE.BoxGeometry(4.05, 0.15, 0.2),
        windowFrameMaterial
    );
    frame.position.set(4, y, -9.7);
    scene.add(frame);
}

// Window middle frame
const middleFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 2.9, 0.2),
    windowFrameMaterial
);
middleFrame.position.set(4, 5.5, -9.7);
scene.add(middleFrame);


// DECORATIVE VASE

const vaseGroup = new THREE.Group();

// Vase body
const vaseGeometry = new THREE.LatheGeometry(
    [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0.25, 0.05),
        new THREE.Vector2(0.4, 0.3),
        new THREE.Vector2(0.45, 0.65),
        new THREE.Vector2(0.3, 0.9),
        new THREE.Vector2(0.2, 1.05),
        new THREE.Vector2(0.2, 1.15)
    ],
    32
);

const vaseMaterial = new THREE.MeshStandardMaterial({
    color: 0xb58b6a,
    roughness: 0.8
});

const vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
vase.position.y = 0.05;
vaseGroup.add(vase);

// Plant leaves
const leafMaterial = new THREE.MeshStandardMaterial({
    color: 0x477447,
    roughness: 0.8
});

for (let i = 0; i < 7; i++) {

    const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        leafMaterial
    );

    const angle = (i / 7) * Math.PI * 2;

    leaf.scale.set(0.65, 2.5, 0.65);

    leaf.position.set(
        Math.cos(angle) * 0.25,
        1.45 + (i % 3) * 0.12,
        Math.sin(angle) * 0.25
    );

    leaf.rotation.z = Math.cos(angle) * 0.35;
    leaf.rotation.x = Math.sin(angle) * 0.35;

    vaseGroup.add(leaf);
}

vaseGroup.position.set(7, 0, -7);
scene.add(vaseGroup);


// LOAD MODELS

const loader = new GLTFLoader();

// Load Table
loader.load('/models/table.glb', function (gltf) {

    const table = gltf.scene;

    // Measure original table
    const originalTableBox = new THREE.Box3().setFromObject(table);
    const originalTableSize = new THREE.Vector3();

    originalTableBox.getSize(originalTableSize);

    // Scale table
    const targetTableWidth = 3.6;
    const tableScale = targetTableWidth /
        Math.max(originalTableSize.x, originalTableSize.z);

    table.scale.setScalar(tableScale);

    // Place table on floor and center it
    let tableBox = new THREE.Box3().setFromObject(table);
    let tableCenter = new THREE.Vector3();

    tableBox.getCenter(tableCenter);

    table.position.x -= tableCenter.x;
    table.position.z -= tableCenter.z;
    table.position.y -= tableBox.min.y;

    scene.add(table);

    // Final table dimensions
    tableBox = new THREE.Box3().setFromObject(table);

    const tableSize = new THREE.Vector3();
    tableCenter = new THREE.Vector3();

    tableBox.getSize(tableSize);
    tableBox.getCenter(tableCenter);


    // Load Chair
    loader.load('/models/chair.glb', function (gltf) {

        const chairModel = gltf.scene;

        // Original chair dimensions
        const originalChairBox = new THREE.Box3().setFromObject(chairModel);
        const originalChairSize = new THREE.Vector3();

        originalChairBox.getSize(originalChairSize);

        // Chair scale
        const targetChairHeight = 1.45;
        const chairScale = targetChairHeight / originalChairSize.y;

        // Chair positions
        const positions = [
            tableCenter.x - tableSize.x * 0.25,
            tableCenter.x + tableSize.x * 0.25,
            tableCenter.x - tableSize.x * 0.25,
            tableCenter.x + tableSize.x * 0.25
        ];

        const rotations = [
            Math.PI,
            Math.PI,
            0,
            0
        ];

        for (let i = 0; i < 4; i++) {

            const chair = chairModel.clone(true);

            chair.scale.setScalar(chairScale);
            chair.rotation.y = rotations[i];

            // Chair dimensions
            const chairBox = new THREE.Box3().setFromObject(chair);
            const chairSize = new THREE.Vector3();
            const chairCenter = new THREE.Vector3();

            chairBox.getSize(chairSize);
            chairBox.getCenter(chairCenter);

            const gap = 0.15;

            // Chair position beside table
            const zPosition = i < 2
                ? tableBox.max.z + chairSize.z / 2 + gap
                : tableBox.min.z - chairSize.z / 2 - gap;

            chair.position.set(
                positions[i] - chairCenter.x,
                -chairBox.min.y,
                zPosition - chairCenter.z
            );

            scene.add(chair);
        }

    });

});


// Resize
window.addEventListener('resize', function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation
function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

animate();
