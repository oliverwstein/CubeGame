import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const xRange = 4;
const yRange = 4;
const zRange = 4;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

function addCube(x, y, z) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x - 1.5, y - 1.5, z - 1.5);

    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
    cube.add(line);

    scene.add(cube);
}

function addDot(x, y, z) {
    const geometry = new THREE.SphereGeometry(0.05, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const dot = new THREE.Mesh(geometry, material);
    dot.position.set(x - 1.5, y - 1.5, z - 1.5);
    scene.add(dot);
}

function drawEdgeLines() {
    const material = new THREE.LineBasicMaterial({ color: 0x000000 });

    // Function to add a line between two points
    function addLine(x1, y1, z1, x2, y2, z2) {
        const points = [];
        points.push(new THREE.Vector3(x1 - 1.5, y1 - 1.5, z1 - 1.5));
        points.push(new THREE.Vector3(x2 - 1.5, y2 - 1.5, z2 - 1.5));
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        scene.add(line);
    }

    // Determine and draw edges based on the matrix dimensions
    for (let x = 0; x <= xRange; x++) {
        for (let y = 0; y <= yRange; y++) {
            for (let z = 0; z <= zRange; z++) {
                // Edges in x-direction
                if (y === 0 || y === yRange || z === 0 || z === zRange) {
                    if (x < xRange) {
                        addLine(x, y, z, x + 1, y, z);
                    }
                }
                // Edges in y-direction
                if (x === 0 || x === xRange || z === 0 || z === zRange) {
                    if (y < yRange) {
                        addLine(x, y, z, x, y + 1, z);
                    }
                }
                // Edges in z-direction
                if (x === 0 || x === xRange || y === 0 || y === yRange) {
                    if (z < zRange) {
                        addLine(x, y, z, x, y, z + 1);
                    }
                }
            }
        }
    }
}

for (let x = 0; x <= xRange; x++) {
    for (let y = 0; y <= yRange; y++) {
        for (let z = 0; z <= zRange; z++) {
            addDot(x, y, z);
        }
    }
}

// Populate the matrix with dots and draw the edge lines
for (let x = 0; x <= xRange; x++) {
    for (let y = 0; y <= yRange; y++) {
        for (let z = 0; z <= zRange; z++) {
            addDot(x, y, z);
        }
    }
}

drawEdgeLines();


camera.position.set(7, 7, 7);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 5;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI;

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render(scene, camera);
}

animate();