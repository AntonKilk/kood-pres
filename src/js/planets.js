import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

// Create planets and add them to the scene
function createPlanets(scene) {
  const planets = [];

  // Planet properties - position, size, color, name
  const planetData = [
    {
      position: new THREE.Vector3(-15, 5, -5),
      size: 2.5,
      color: 0x3498db,
      name: "Background",
    },
    {
      position: new THREE.Vector3(0, 0, -12),
      size: 3,
      color: 0x2ecc71,
      name: "Motivation",
    },
    {
      position: new THREE.Vector3(12, -3, -8),
      size: 2,
      color: 0xf6dba6,
      name: "Bootcamp Experience",
    },
    {
      position: new THREE.Vector3(-8, -7, 2),
      size: 2.8,
      color: 0xf39c12,
      name: "Education at Hive",
    },
    {
      position: new THREE.Vector3(10, 8, 7),
      size: 2.2,
      color: 0x65cade,
      name: "Job Search",
    },
    // Additional planets
    {
      position: new THREE.Vector3(-5, 12, 0),
      size: 2.4,
      color: 0xb75516,
      name: "Engineering Practices",
    },
    {
      position: new THREE.Vector3(6, -9, -10),
      size: 3.2,
      color: 0xd35400,
      name: "Advice",
    },
    {
      position: new THREE.Vector3(-18, -4, 8),
      size: 2.6,
      color: 0x8e44ad,
      name: "Conclusions",
    },
  ];

  planetData.forEach((data, index) => {
    // Create planet
    const planet = createPlanet(data, index);
    scene.add(planet);
    planets.push(planet);

    // Add orbit rings
    addOrbitRing(scene, data.position, data.size + 0.5, data.color);

    // Add number label
    addPlanetLabel(scene, data.position, data.size, index + 1);
  });

  return planets;
}

// Create a single planet
function createPlanet(data, index) {
  // Create planet geometry
  const geometry = new THREE.SphereGeometry(data.size, 32, 32);

  // Create unique material for each planet
  let material;
  if (index % 2 === 0) {
    // Standard material with phong shading
    material = new THREE.MeshPhongMaterial({
      color: data.color,
      shininess: 30,
      flatShading: false,
    });
  } else {
    // Material with noise pattern
    material = new THREE.MeshStandardMaterial({
      color: data.color,
      roughness: 0.7,
      metalness: 0.3,
    });

    // Add some random bump to the surface
    const bumpTexture = createNoiseBumpMap(256);
    material.bumpMap = bumpTexture;
    material.bumpScale = 0.1;
  }

  // Create mesh and add user data
  const planet = new THREE.Mesh(geometry, material);
  planet.position.copy(data.position);
  planet.userData = {
    name: data.name,
    index: index,
    originalPosition: data.position.clone(),
    originalSize: data.size,
  };

  return planet;
}

// Create a procedural bump map for planet texture
function createNoiseBumpMap(size) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  // Fill with black
  context.fillStyle = "black";
  context.fillRect(0, 0, size, size);

  // Add noise
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const value = Math.floor(Math.random() * 255);
      context.fillStyle = `rgb(${value}, ${value}, ${value})`;
      context.fillRect(x, y, 1, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Add orbit rings around planets
function addOrbitRing(scene, position, radius, color) {
  const ringGeometry = new THREE.RingGeometry(radius, radius + 0.1, 64);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.4,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);

  // Position ring
  ring.position.copy(position);

  // Random orientation
  ring.rotation.x = Math.random() * Math.PI;
  ring.rotation.y = Math.random() * Math.PI;

  scene.add(ring);
}

// Function to add a number label to a planet
function addPlanetLabel(scene, position, size, number) {
  // Create the main div container
  const div = document.createElement("div");
  div.className = "planet-label";

  // Create the circular background
  const circle = document.createElement("div");
  circle.className = "planet-label-circle";

  // Add the number
  const numberSpan = document.createElement("span");
  numberSpan.textContent = number;
  numberSpan.className = "planet-label-number";

  // Add the arrow
  const arrow = document.createElement("div");
  arrow.className = "planet-label-arrow";

  // Assemble the elements
  circle.appendChild(numberSpan);
  circle.appendChild(arrow);
  div.appendChild(circle);

  // Create the CSS2D object and position it
  const label = new CSS2DObject(div);
  label.position.set(position.x, position.y + size + 1.5, position.z);
  scene.add(label);
}

export { createPlanets };
