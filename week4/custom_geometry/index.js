import * as THREE from 'three'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 3;

const geometry = new THREE.BufferGeometry();

const positions = new Float32Array([
    // Trupi i shtepise - trekendeshi i pare
    0, 0, 0,
    1, 0, 0,
    0, 1, 0,

    // Trupi i shtepise - trekendeshi i dyte
    1, 0, 0,
    1, 1, 0,
    0, 1, 0,

    // Kulmi i shtepise
    0, 1, 0,
    1, 1, 0,
    0.5, 1.7, 0
]);

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const light = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(light);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('scene').appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();