import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

/**
 * Base Setup
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue background

// Fog for distance effect
scene.fog = new THREE.Fog(0x87ceeb, 15, 50);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Improved light setup for better shadows
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Handle window resize
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 1.6, 5); // Eye level (1.6m) standing at the start of the path
scene.add(camera);

/**
 * Controls
 */
// First person controls for walking through the path
const controls = new PointerLockControls(camera, canvas);

// Instructions for controls
const instructions = document.createElement("div");
instructions.innerHTML = `
    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
    background-color: rgba(0, 0, 0, 0.7); color: white; padding: 20px; border-radius: 5px; 
    text-align: center; font-family: Arial, sans-serif;">
        <h1>Presentation Path</h1>
        <p>Click to start | WASD to move | Mouse to look | ESC to exit</p>
        <button id="startButton" style="padding: 10px 20px; background-color: #4CAF50; 
        color: white; border: none; border-radius: 4px; cursor: pointer;">
            Start Presentation
        </button>
    </div>
`;
instructions.style.position = "absolute";
instructions.style.width = "100%";
instructions.style.height = "100%";
instructions.style.top = "0";
instructions.style.left = "0";
document.body.appendChild(instructions);

// Click handler for instructions
document.getElementById("startButton").addEventListener("click", function () {
  controls.lock();
  instructions.style.display = "none";

  // Add crosshair when the controls are locked
  const crosshair = document.createElement("div");
  crosshair.className = "crosshair";
  document.body.appendChild(crosshair);
});

// Event handlers for controls
controls.addEventListener("lock", function () {
  instructions.style.display = "none";
});

controls.addEventListener("unlock", function () {
  instructions.style.display = "block";

  // Remove crosshair when controls are unlocked
  const crosshair = document.querySelector(".crosshair");
  if (crosshair) crosshair.remove();
});

// Movement variables
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// Key listeners for movement
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyW":
    case "ArrowUp":
      moveForward = true;
      break;
    case "KeyA":
    case "ArrowLeft":
      moveLeft = true;
      break;
    case "KeyS":
    case "ArrowDown":
      moveBackward = true;
      break;
    case "KeyD":
    case "ArrowRight":
      moveRight = true;
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyW":
    case "ArrowUp":
      moveForward = false;
      break;
    case "KeyA":
    case "ArrowLeft":
      moveLeft = false;
      break;
    case "KeyS":
    case "ArrowDown":
      moveBackward = false;
      break;
    case "KeyD":
    case "ArrowRight":
      moveRight = false;
      break;
  }
});

/**
 * Path and Doors Setup
 */
// Path dimensions
const pathLength = 50;
const pathWidth = 5;
const wallHeight = 3;

// Floor
const floorGeometry = new THREE.PlaneGeometry(pathWidth, pathLength);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x808080,
  roughness: 0.8,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.set(0, 0, -pathLength / 2 + 5); // Position the path ahead of the starting point
floor.receiveShadow = true;
scene.add(floor);

// Walls
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0xa9a9a9,
  roughness: 0.6,
});

// Left wall
const leftWallGeometry = new THREE.PlaneGeometry(pathLength, wallHeight);
const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
leftWall.position.set(-pathWidth / 2, wallHeight / 2, -pathLength / 2 + 5);
leftWall.rotation.y = Math.PI / 2;
leftWall.castShadow = true;
leftWall.receiveShadow = true;
scene.add(leftWall);

// Right wall
const rightWallGeometry = new THREE.PlaneGeometry(pathLength, wallHeight);
const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
rightWall.position.set(pathWidth / 2, wallHeight / 2, -pathLength / 2 + 5);
rightWall.rotation.y = -Math.PI / 2;
rightWall.castShadow = true;
rightWall.receiveShadow = true;
scene.add(rightWall);

// Create doors with slide titles
function createDoor(side, position, title) {
  // Door dimensions
  const doorWidth = 1.5;
  const doorHeight = 2.2;

  // Door frame
  const frameGeometry = new THREE.BoxGeometry(
    0.2,
    doorHeight + 0.2,
    doorWidth + 0.2
  );
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // Brown wood color
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);

  // Door
  const doorGeometry = new THREE.BoxGeometry(0.1, doorHeight, doorWidth);
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b0000, // Dark red
    roughness: 0.5,
  });
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.castShadow = true;

  // Door handle
  const handleGeometry = new THREE.SphereGeometry(0.08, 16, 16);
  const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37, // Gold
    metalness: 0.7,
    roughness: 0.3,
  });
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.position.set(side === "left" ? 0.15 : -0.15, 0, doorWidth / 3);
  door.add(handle);

  // Door title
  const titleCanvas = document.createElement("canvas");
  const context = titleCanvas.getContext("2d");
  titleCanvas.width = 256;
  titleCanvas.height = 128;
  context.fillStyle = "white";
  context.fillRect(0, 0, titleCanvas.width, titleCanvas.height);
  context.font = "bold 24px Arial";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(title, titleCanvas.width / 2, titleCanvas.height / 2);

  const titleTexture = new THREE.CanvasTexture(titleCanvas);
  const titleMaterial = new THREE.MeshBasicMaterial({ map: titleTexture });
  const titleGeometry = new THREE.PlaneGeometry(doorWidth - 0.2, 0.5);
  const titleMesh = new THREE.Mesh(titleGeometry, titleMaterial);
  titleMesh.position.set(side === "left" ? 0.1 : -0.1, doorHeight / 2 + 0.3, 0);
  door.add(titleMesh);

  // Position the door in the wall
  if (side === "left") {
    door.position.set(-pathWidth / 2 - 0.05, doorHeight / 2, position);
    door.rotation.y = -Math.PI / 2;
    frame.position.set(-pathWidth / 2 - 0.1, doorHeight / 2, position);
    frame.rotation.y = -Math.PI / 2;
  } else {
    door.position.set(pathWidth / 2 + 0.05, doorHeight / 2, position);
    door.rotation.y = Math.PI / 2;
    frame.position.set(pathWidth / 2 + 0.1, doorHeight / 2, position);
    frame.rotation.y = Math.PI / 2;
  }

  // Add door and frame to scene
  scene.add(door);
  scene.add(frame);

  // Make the door interactive
  door.userData = { isInteractive: true, title: title };
  return door;
}

// Create doors along the path
const doorData = [
  { side: "left", position: 0, title: "Introduction" },
  { side: "right", position: 0, title: "Background" },
  { side: "left", position: -5, title: "Problem Statement" },
  { side: "right", position: -5, title: "Methodology" },
  { side: "left", position: -10, title: "Results" },
  { side: "right", position: -10, title: "Discussion" },
  { side: "left", position: -15, title: "Conclusion" },
  { side: "right", position: -15, title: "Future Work" },
];

const doors = [];
doorData.forEach((data) => {
  doors.push(createDoor(data.side, data.position, data.title));
});

// Raycaster for door interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let INTERSECTED = null;
let currentImage = null;

function onMouseClick(event) {
  if (controls.isLocked) {
    // Center of screen is target for raycasting in first-person mode
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    const intersects = raycaster.intersectObjects(doors);

    if (intersects.length > 0) {
      enterDoor(intersects[0].object);
    } else if (currentImage) {
      // Exit the current slide view
      scene.remove(currentImage);
      currentImage = null;
    }
  }
}

window.addEventListener("click", onMouseClick);

function enterDoor(door) {
  const title = door.userData.title;
  console.log(`Entering door: ${title}`);

  // Remove previous image if exists
  if (currentImage) {
    scene.remove(currentImage);
  }

  // Create a placeholder image for the slide
  const imageGeometry = new THREE.PlaneGeometry(4, 3);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 1024;
  canvas.height = 768;

  // Fill the canvas with a light color
  context.fillStyle = "#f0f0f0";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Add a border
  context.strokeStyle = "#333";
  context.lineWidth = 10;
  context.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

  // Add the title
  context.font = "bold 80px Arial";
  context.fillStyle = "#333";
  context.textAlign = "center";
  context.fillText(title, canvas.width / 2, 150);

  // Add placeholder text
  context.font = "40px Arial";
  context.fillText(
    "Slide content will be added later",
    canvas.width / 2,
    canvas.height / 2
  );
  context.fillText(
    "Click anywhere to return to the path",
    canvas.width / 2,
    canvas.height / 2 + 80
  );

  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  currentImage = new THREE.Mesh(imageGeometry, material);

  // Position the image in front of the camera
  const distance = 2;
  camera.getWorldDirection(direction);
  currentImage.position
    .copy(camera.position)
    .add(direction.multiplyScalar(distance));

  // Make the image face the camera
  currentImage.lookAt(camera.position);

  scene.add(currentImage);
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Handle movement
  if (controls.isLocked) {
    // Calculate movement direction
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    // Apply movement velocity
    const speed = 3.0; // units per second
    if (moveForward || moveBackward)
      velocity.z = direction.z * speed * deltaTime;
    if (moveLeft || moveRight) velocity.x = direction.x * speed * deltaTime;

    // Apply movement
    controls.moveRight(velocity.x);
    controls.moveForward(velocity.z);

    // Reset velocity
    velocity.x = 0;
    velocity.z = 0;

    // Update the image position if it exists
    if (currentImage) {
      camera.getWorldDirection(direction);
      currentImage.position
        .copy(camera.position)
        .add(direction.multiplyScalar(2));
      currentImage.lookAt(camera.position);
    }
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
