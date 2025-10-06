// SnoozeCorp Content Script
// Displays an overlay on News Corp sites

// Function to create and display the overlay
function showOverlay() {
  // Create overlay elements
  const overlay = document.createElement('div');
  overlay.className = 'snooze-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Arial, sans-serif;
    color: white;
    text-align: center;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    max-width: 500px;
    padding: 20px;
    background-color: #333;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  `;

  const title = document.createElement('h1');
  title.textContent = '🚫 Blocked Site';
  title.style.cssText = `
    font-size: 2em;
    margin-bottom: 10px;
    color: #ff4444;
  `;

  const message = document.createElement('p');
  message.textContent = `${window.location.hostname} is owned by News Corp and has been blocked.`;
  message.style.cssText = `
    font-size: 1.2em;
    margin-bottom: 20px;
  `;

  const note = document.createElement('p');
  note.textContent = 'This extension helps avoid supporting Murdoch-owned media.';
  note.style.cssText = `
    font-size: 0.9em;
    opacity: 0.8;
  `;

  // Assemble overlay
  content.appendChild(title);
  content.appendChild(message);
  content.appendChild(note);
  overlay.appendChild(content);

  // Add to page
  document.body.appendChild(overlay);

  // Prevent interaction with underlying page
  overlay.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('keydown', (e) => e.preventDefault());
  document.addEventListener('contextmenu', (e) => e.preventDefault());
}

// Show the overlay immediately
showOverlay();
function showBlockOverlay() {
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.id = 'snoozecorp-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 999999;
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 20px;
    box-sizing: border-box;
  `;

  // Create content
  const title = document.createElement('h1');
  title.textContent = '🚫 Site Blocked';
  title.style.cssText = `
    font-size: 2em;
    margin-bottom: 20px;
  `;

  const message = document.createElement('p');
  message.textContent = `${document.domain} is owned by News Corp (Rupert Murdoch) and has been blocked by SnoozeCorp.`;
  message.style.cssText = `
    font-size: 1.2em;
    margin-bottom: 30px;
    max-width: 600px;
  `;

  const button = document.createElement('button');
  button.textContent = 'Continue Anyway';
  button.style.cssText = `
    padding: 10px 20px;
    font-size: 1em;
    background-color: #ff4444;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `;
  button.onclick = () => {
    overlay.remove();
  };

  // Assemble overlay
  overlay.appendChild(title);
  overlay.appendChild(message);
  overlay.appendChild(button);

  // Add to page
  document.body.appendChild(overlay);

  // Prevent scrolling
  document.body.style.overflow = 'hidden';
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', showBlockOverlay);
} else {
  showBlockOverlay();
}