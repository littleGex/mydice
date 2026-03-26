const dice = document.getElementById('dice');
const resultText = document.getElementById('result');

dice.addEventListener('click', () => {
  // Generate random number 1-6
  const rollResult = Math.floor(Math.random() * 6) + 1;
  
  // Add extra 360-degree spins for the animation
  const randomSpins = Math.floor(Math.random() * 3) + 2; 
  let x = 0, y = 0;

  // Determine which way to rotate based on the result
  switch (rollResult) {
    case 1: x = 0; y = 0; break;       // Front
    case 2: x = -90; y = 0; break;     // Top
    case 3: x = 0; y = -90; break;     // Right
    case 4: x = 0; y = 90; break;      // Left
    case 5: x = 90; y = 0; break;      // Bottom
    case 6: x = 0; y = 180; break;     // Back
  }

  // Apply the extra spins
  x += randomSpins * 360;
  y += randomSpins * 360;

  // Apply the rotation and update text
  dice.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  resultText.textContent = "Rolling...";

  // Wait for the CSS transition to finish before showing the result
  setTimeout(() => {
    resultText.textContent = `You rolled a ${rollResult}!`;
  }, 1000); 
});

// Register Service Worker for Offline Mode
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log("Offline capabilities enabled!"))
    .catch(err => console.error("Offline setup failed", err));
}
