import * as THREE from 'three';

// Animation loop
function animate(scene, camera, renderer, labelRenderer, controls, planets, raycaster, mouse, currentPlanet, isTransitioning) {
    requestAnimationFrame(() => animate(scene, camera, renderer, labelRenderer, controls, planets, raycaster, mouse, currentPlanet, isTransitioning));
    
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

export { animate };
