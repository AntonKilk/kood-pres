import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

import { setupScene } from './scene.js';
import { createPlanets } from './planets.js';
import { setupSlides } from './slides.js';
import { animate } from './animation.js';
import { setupFavicon } from './favicon.js';

// Main variables
let camera, scene, renderer, labelRenderer, controls;
let raycaster, mouse;
let currentPlanet = null;
let isTransitioning = false;
let planets = [];

// Initialize the application
function init() {
    // Setup favicon
    setupFavicon();
    
    // Setup scene, camera and renderers
    const sceneSetup = setupScene();
    scene = sceneSetup.scene;
    camera = sceneSetup.camera;
    renderer = sceneSetup.renderer;
    
    // Setup CSS2D renderer for labels
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.className = 'css2d-renderer';
    document.body.appendChild(labelRenderer.domElement);
    
    // Setup controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    
    // Setup raycaster for interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Create planets
    planets = createPlanets(scene);
    
    // Setup slides
    setupSlides(planets, exitPlanetView, showSlide);
    
    // Event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    
    // Start animation loop
    animate(scene, camera, renderer, labelRenderer, controls, planets, raycaster, mouse, currentPlanet, isTransitioning);
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

// Initialize the scene when document is loaded
window.addEventListener('DOMContentLoaded', init);

// Make variables available globally for debugging if needed
if (typeof window !== 'undefined') {
    window.spacePresentation = {
        camera,
        scene,
        renderer,
        labelRenderer,
        controls,
        planets,
        raycaster,
        mouse
    };
}
