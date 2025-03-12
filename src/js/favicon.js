// Import the planet SVG directly as a module
import planetSvg from '../assets/images/planet.svg';

// Set up the favicon dynamically
function setupFavicon() {
  // Create a link element for the favicon
  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/svg+xml';
  favicon.href = planetSvg;
  
  // Add it to the document head
  document.head.appendChild(favicon);
}

export { setupFavicon };
