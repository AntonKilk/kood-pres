import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

// Main variables
let camera, scene, renderer, controls;
let labelRenderer; // For CSS2D labels
let planets = [];
let raycaster, mouse;
let currentPlanet = null;
let isTransitioning = false;

// Scene setup
function init() {
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 35;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('canvas.webgl'),
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Label renderer
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(labelRenderer.domElement);
    
    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    
    // Raycaster for interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Add lights
    addLights();
    
    // Create space background
    createStars();
    
    // Create planets
    createPlanets();
    
    // Add slide content containers to DOM
    createSlideContainers();
    
    // Event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    
    // Start animation loop
    animate();
}

// Add lights to the scene
function addLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const sunLight = new THREE.PointLight(0xffffff, 1.5, 100);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    
    // Add a subtle directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
}

// Create a starry background
function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Add a subtle fog for depth
    scene.fog = new THREE.FogExp2(0x000000, 0.00025);
}

// Create planets
function createPlanets() {
    // Planet properties - position, size, color, name
    const planetData = [
        { position: new THREE.Vector3(-15, 5, -5), size: 2.5, color: 0x3498db, name: "Slide 1" },
        { position: new THREE.Vector3(0, 0, -12), size: 3, color: 0x2ecc71, name: "Slide 2" },
        { position: new THREE.Vector3(12, -3, -8), size: 2, color: 0xe74c3c, name: "Slide 3" },
        { position: new THREE.Vector3(-8, -7, 2), size: 2.8, color: 0xf39c12, name: "Slide 4" },
        { position: new THREE.Vector3(10, 8, 7), size: 2.2, color: 0x9b59b6, name: "Slide 5" },
        // New planets
        { position: new THREE.Vector3(-5, 12, 0), size: 2.4, color: 0x1abc9c, name: "Slide 6" },
        { position: new THREE.Vector3(6, -9, -10), size: 3.2, color: 0xd35400, name: "Slide 7" },
        { position: new THREE.Vector3(-18, -4, 8), size: 2.6, color: 0x8e44ad, name: "Slide 8" }
    ];
    
    planetData.forEach((data, index) => {
        // Create planet geometry
        const geometry = new THREE.SphereGeometry(data.size, 32, 32);
        
        // Create unique material for each planet
        let material;
        if (index % 2 === 0) {
            // Standard material with phong shading
            material = new THREE.MeshPhongMaterial({ 
                color: data.color,
                shininess: 30,
                flatShading: false
            });
        } else {
            // Material with noise pattern
            material = new THREE.MeshStandardMaterial({
                color: data.color,
                roughness: 0.7,
                metalness: 0.3
            });
            
            // Add some random bump to the surface
            const bumpTexture = createNoiseBumpMap(256);
            material.bumpMap = bumpTexture;
            material.bumpScale = 0.1;
        }
        
        // Create mesh and add to scene
        const planet = new THREE.Mesh(geometry, material);
        planet.position.copy(data.position);
        planet.userData = { 
            name: data.name,
            index: index,
            originalPosition: data.position.clone(),
            originalSize: data.size
        };
        scene.add(planet);
        planets.push(planet);
        
        // Add orbit rings
        addOrbitRing(data.position, data.size + 0.5, data.color);
        
        // Add number label
        addPlanetLabel(data.position, data.size, index + 1);
    });
}

// Create a procedural bump map for planet texture
function createNoiseBumpMap(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    
    // Fill with black
    context.fillStyle = 'black';
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
function addOrbitRing(position, radius, color) {
    const ringGeometry = new THREE.RingGeometry(radius, radius + 0.1, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: color, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    
    // Position ring
    ring.position.copy(position);
    
    // Random orientation
    ring.rotation.x = Math.random() * Math.PI;
    ring.rotation.y = Math.random() * Math.PI;
    
    scene.add(ring);
}

// Create HTML containers for slides
function createSlideContainers() {
    const container = document.createElement('div');
    container.id = 'slideContainer';
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.display = 'none';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.zIndex = '10';
    document.body.appendChild(container);
    
    // Create a "back to space" button
    const backButton = document.createElement('button');
    backButton.textContent = 'Back to Space';
    backButton.style.position = 'absolute';
    backButton.style.top = '20px';
    backButton.style.left = '20px';
    backButton.style.padding = '10px 15px';
    backButton.style.backgroundColor = '#2980b9';
    backButton.style.color = 'white';
    backButton.style.border = 'none';
    backButton.style.borderRadius = '5px';
    backButton.style.cursor = 'pointer';
    backButton.style.zIndex = '20';
    backButton.style.display = 'none';
    backButton.id = 'backButton';
    backButton.addEventListener('click', exitPlanetView);
    document.body.appendChild(backButton);
    
    // Create individual slide divs
    for (let i = 0; i < 8; i++) {
        const slide = document.createElement('div');
        slide.id = `slide-${i}`;
        slide.className = 'slide';
        slide.style.display = 'none';
        slide.style.width = '80%';
        slide.style.height = '80%';
        slide.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        slide.style.borderRadius = '10px';
        slide.style.padding = '20px';
        slide.style.color = 'white';
        slide.style.overflow = 'auto';
        
        // Slide title
        const title = document.createElement('h2');
        title.textContent = `Slide ${i + 1}`;
        title.style.marginBottom = '20px';
        title.style.textAlign = 'center';
        slide.appendChild(title);
        
        // Create image gallery
        const imageContainer = document.createElement('div');
        imageContainer.style.display = 'flex';
        imageContainer.style.flexWrap = 'wrap';
        imageContainer.style.justifyContent = 'center';
        imageContainer.style.gap = '10px';
        
        // Add some placeholder images
        for (let j = 0; j < 4; j++) {
            const img = document.createElement('div');
            img.style.width = '45%';
            img.style.height = '200px';
            img.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
            img.style.borderRadius = '5px';
            img.style.display = 'flex';
            img.style.justifyContent = 'center';
            img.style.alignItems = 'center';
            img.innerHTML = `<span style="font-size: 24px;">Image ${j + 1}</span>`;
            imageContainer.appendChild(img);
        }
        
        slide.appendChild(imageContainer);
        container.appendChild(slide);
    }
}

// Show a specific slide
function showSlide(index) {
    const slideContainer = document.getElementById('slideContainer');
    slideContainer.style.display = 'flex';
    
    // Hide all slides first
    document.querySelectorAll('.slide').forEach(slide => {
        slide.style.display = 'none';
    });
    
    // Show the selected slide
    const slide = document.getElementById(`slide-${index}`);
    slide.style.display = 'block';
    
    // Show back button
    document.getElementById('backButton').style.display = 'block';
    
    // Disable controls while in slide view
    controls.enabled = false;
}

// Return to the space view
function exitPlanetView() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    // Hide slide container and back button
    document.getElementById('slideContainer').style.display = 'none';
    document.getElementById('backButton').style.display = 'none';
    
    // Return to original position
    const originalPosition = new THREE.Vector3(0, 0, 35);
    
    // Animate camera back to original position
    animateCamera(originalPosition, new THREE.Vector3(0, 0, 0), 1500, () => {
        currentPlanet = null;
        isTransitioning = false;
        controls.enabled = true;
    });
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

// Track mouse movement
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Handle clicks
function onClick() {
    if (isTransitioning || currentPlanet !== null) return;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets, false);
    
    if (intersects.length > 0) {
        const planet = intersects[0].object;
        zoomToPlanet(planet);
    }
}

// Zoom to a selected planet
function zoomToPlanet(planet) {
    isTransitioning = true;
    currentPlanet = planet;
    
    // Calculate target position (slightly offset from planet)
    const planetPos = planet.position.clone();
    const cameraOffset = planetPos.clone().normalize().multiplyScalar(planet.userData.originalSize * 3);
    const targetPosition = planetPos.clone().add(cameraOffset);
    
    // Animate camera to target position
    animateCamera(targetPosition, planetPos, 2000, () => {
        showSlide(planet.userData.index);
        isTransitioning = false;
    });
}

// Animate camera movement
function animateCamera(targetPosition, lookAtTarget, duration, callback) {
    const startPosition = camera.position.clone();
    const startLookAt = controls.target.clone();
    const startTime = Date.now();
    
    function updateCamera() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth motion
        const easeProgress = 1 - Math.cos(progress * Math.PI / 2);
        
        // Update camera position
        camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
        
        // Update controls target (what camera is looking at)
        controls.target.lerpVectors(startLookAt, lookAtTarget, easeProgress);
        controls.update();
        
        if (progress < 1) {
            requestAnimationFrame(updateCamera);
        } else {
            if (callback) callback();
        }
    }
    
    updateCamera();
}

// Function to add a number label to a planet
function addPlanetLabel(position, size, number) {
    const div = document.createElement('div');
    div.className = 'planet-label';
    
    // Create arrow container
    div.style.width = '40px';
    div.style.height = '40px';
    div.style.backgroundColor = 'rgba(40, 40, 40, 0.8)';
    div.style.borderRadius = '50%';
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    div.style.position = 'relative';
    div.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.3)';
    
    // Add number inside
    const numberSpan = document.createElement('span');
    numberSpan.textContent = number;
    numberSpan.style.color = 'white';
    numberSpan.style.fontSize = '1.2em';
    numberSpan.style.fontWeight = 'bold';
    numberSpan.style.position = 'absolute';
    numberSpan.style.top = '50%';
    numberSpan.style.left = '50%';
    numberSpan.style.transform = 'translate(-50%, -50%)';
    div.appendChild(numberSpan);
    
    // Add arrow pointing down to the planet
    const arrow = document.createElement('div');
    arrow.style.position = 'absolute';
    arrow.style.bottom = '-12px';
    arrow.style.left = '50%';
    arrow.style.transform = 'translateX(-50%)';
    arrow.style.width = '0';
    arrow.style.height = '0';
    arrow.style.borderLeft = '10px solid transparent';
    arrow.style.borderRight = '10px solid transparent';
    arrow.style.borderTop = '12px solid rgba(40, 40, 40, 0.8)';
    div.appendChild(arrow);
    
    const label = new CSS2DObject(div);
    // Position the label above the planet
    label.position.set(position.x, position.y + size + 1.5, position.z);
    scene.add(label);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Rotate planets
    planets.forEach(planet => {
        planet.rotation.y += 0.005;
        planet.rotation.x += 0.002;
    });
    
    // Highlight planets on hover (if not in slide view)
    if (currentPlanet === null && !isTransitioning) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(planets, false);
        
        // Reset all planets
        planets.forEach(planet => {
            if (planet.material.emissive) {
                planet.material.emissive.set(0x000000);
            }
            document.body.style.cursor = 'default';
        });
        
        // Highlight hovered planet
        if (intersects.length > 0) {
            const planet = intersects[0].object;
            if (planet.material.emissive) {
                planet.material.emissive.set(0x333333);
            }
            document.body.style.cursor = 'pointer';
        }
    }
    
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

// Initialize the scene
init();
