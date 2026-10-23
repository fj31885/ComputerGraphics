
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z=4;

// Dritat
const pointLight = new THREE.PointLight(0xffffff, 3);
pointLight.position.set(0, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(pointLight, ambientLight);

// Dielli
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);

// Toka rreth Diellit
const earthOrbit = new THREE.Object3D();
scene.add(earthOrbit);

const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthMesh.position.x = 3;
earthOrbit.add(earthMesh);

// Hena rreth Tokes
const moonOrbit = new THREE.Object3D();
earthMesh.add(moonOrbit);

const moonGeometry = new THREE.SphereGeometry(0.15, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonMesh.position.x = 0.8;
moonOrbit.add(moonMesh);

// Marsi rreth Diellit
const marsOrbit = new THREE.Object3D();
scene.add(marsOrbit);

const marsGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const marsMaterial = new THREE.MeshStandardMaterial({ color: 0xff3300 });
const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
marsMesh.position.x = 5;
marsOrbit.add(marsMesh);

// Phobos rreth Marsit
const phobosOrbit = new THREE.Object3D();
marsMesh.add(phobosOrbit);

const phobosGeometry = new THREE.SphereGeometry(0.12, 32, 32);
const phobosMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const phobosMesh = new THREE.Mesh(phobosGeometry, phobosMaterial);
phobosMesh.position.x = 0.7;
phobosOrbit.add(phobosMesh);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Animacioni
function animate() {
    requestAnimationFrame(animate);

    earthOrbit.rotation.y += 0.01;
    moonOrbit.rotation.y += 0.04;

    marsOrbit.rotation.y += 0.005;
    phobosOrbit.rotation.y += 0.06;

    controls.update();
    renderer.render(scene, camera);
}

animate();
