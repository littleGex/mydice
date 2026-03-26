const dice = document.getElementById('dice');
const resultText = document.getElementById('result');

let currentX = 0;
let currentY = 0;
let isRolling = false; // Prevents rolling again while already spinning

// --- THE ROLLING LOGIC ---
function rollDice() {
  if (isRolling) return;
  isRolling = true;
  
  const roll = Math.floor(Math.random() * 6) + 1;
  const extraSpins = 3 + Math.floor(Math.random() * 5); 
  
  let targetX = 0;
  let targetY = 0;

  switch (roll) {
    case 1: targetX = 0;   targetY = 0;   break;
    case 6: targetX = 0;   targetY = 180; break;
    case 3: targetX = 0;   targetY = -90; break;
    case 4: targetX = 0;   targetY = 90;  break;
    case 2: targetX = -90; targetY = 0;   break;
    case 5: targetX = 90;  targetY = 0;   break;
  }

  currentX += (extraSpins * 360) + targetX;
  currentY += (extraSpins * 360) + targetY;

  dice.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
  resultText.textContent = "Rolling...";

  setTimeout(() => {
    resultText.textContent = `You rolled a ${roll}!`;
    isRolling = false;
  }, 1000);
}

// --- SHAKE DETECTION LOGIC ---
function enableShake() {
  // Check if iOS requires permission
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('devicemotion', handleMotion);
        }
      })
      .catch(console.error);
  } else {
    // Non-iOS devices don't need explicit permission
    window.addEventListener('devicemotion', handleMotion);
  }
}

// Detect sharp movements
function handleMotion(event) {
  const threshold = 15; // How hard you have to shake it
  const accel = event.accelerationIncludingGravity;
  
  if (!accel) return;

  const totalAcceleration = Math.abs(accel.x) + Math.abs(accel.y) + Math.abs(accel.z);
  
  if (totalAcceleration > threshold) {
    rollDice();
  }
}

// --- EVENT LISTENERS ---
dice.addEventListener('click', () => {
  rollDice();
  enableShake(); // We ask for shake permission on the first tap
});
