import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class MatrixScene extends THREE.Scene {
    constructor(xRange, yRange, zRange) {
        super();
        this.xRange = xRange;
        this.yRange = yRange;
        this.zRange = zRange;
        this.dots = []; // Initialize an empty 3D array
        this.cubes = []; // Initialize an empty 3D array

        // Initialize the 3D array with null (or undefined) values
        for (let x = 0; x <= xRange; x++) {
            this.dots[x] = [];
            for (let y = 0; y <= yRange; y++) {
                this.dots[x][y] = new Array(zRange + 1).fill(null);
            }
        }

        this.addAmbientLight();
        this.addDirectionalLight();
    }

    addAmbientLight() {
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.add(ambientLight);
    }

    addDirectionalLight() {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.add(directionalLight);
    }

    addDot(x, y, z) {
        const geometry = new THREE.SphereGeometry(0.05, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const dot = new THREE.Mesh(geometry, material);
        dot.position.set(x - 1.5, y - 1.5, z - 1.5);
        this.add(dot);

        // Store the dot in the 3D array
        this.dots[x][y][z] = dot;
    }

    addCube(x, y, z) {
        // Define the geometry for a unit cube (size 1x1x1)
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        // Define the material for the cube
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 }); // Example: bright green color
        // Create the mesh object combining geometry and material
        const cube = new THREE.Mesh(geometry, material);
        // Adjust the cube's position to align with the matrix grid
        // Assuming the center of each cube aligns with its grid position
        cube.position.set(x - 1.5, y - 1.5, z - 1.5);
        // Add the cube to the scene
        this.add(cube);
        
        // Ensure the 'cubes' array is initialized properly to avoid errors
        if (!this.cubes[x]) this.cubes[x] = [];
        if (!this.cubes[x][y]) this.cubes[x][y] = [];
        this.cubes[x][y][z] = cube;
    }
    

}

const xRange = 4;
const yRange = 4;
const zRange = 4;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}
function onMouseClick(event) {
    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        // Assuming your cubes are directly added to the scene, the first intersected object is selected
        const selectedObject = intersects[0].object;
        
        // Perform actions with the selected object, e.g., change its color or material
        selectedObject.material.color.set(0xff0000); // Example: change color to red
    }
}
window.addEventListener('click', onMouseClick, false);
window.addEventListener('mousemove', onMouseMove, false);
const scene = new MatrixScene(xRange, yRange, zRange);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(7, 7, 7);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 5;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI;

// Populate the matrix with dots
for (let x = 0; x <= xRange; x++) {
    for (let y = 0; y <= yRange; y++) {
        for (let z = 0; z <= zRange; z++) {
            scene.addDot(x, y, z);
        }
    }
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

// Populate the matrix with dots and draw the edge lines
for (let x = 0; x <= xRange; x++) {
    for (let y = 0; y <= yRange; y++) {
        for (let z = 0; z <= zRange; z++) {
            scene.addDot(x, y, z);
            scene.addCube(x, y, z);
        }
    }
}

drawEdgeLines();

scene.dots[0][0][0].material.color.set(0xff0000);
camera.position.set(7, 7, 7);
camera.lookAt(2, 2, 2);


function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render(scene, camera);
}

animate();