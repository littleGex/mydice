const dice = document.getElementById('dice');
const resultText = document.getElementById('result');
const styleButtons = document.querySelectorAll('.style-btn');

let currentX = 0;
let currentY = 0;
let isRolling = false; // Prevents rolling again while already spinning
let shakeEnabled = false;
let lastShakeTime = 0;
const SHAKE_DEBOUNCE = 500; // Prevent multiple rolls from single shake

// --- STYLE SWITCHING ---
function setDiceStyle(style) {
  // Remove all style classes
  dice.classList.remove('dice-style-classic', 'dice-style-red', 'dice-style-white', 'dice-style-colorful');
  // Add the selected style
  dice.classList.add(`dice-style-${style}`);
  
  // Update button states
  styleButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.style === style);
  });
}

// Initialize with classic style
setDiceStyle('classic');

// Add event listeners to style buttons
styleButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    setDiceStyle(btn.dataset.style);
  });
});

// --- THE ROLLING LOGIC ---
function rollDice() {
  if (isRolling) return;
  isRolling = true;
  
  const roll = Math.floor(Math.random() * 6) + 1;
  const extraSpins = 5 + Math.floor(Math.random() * 5); // 5-9 full rotations for consistent rolling
  
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

  dice.style.transform = `rotateY(${extraSpins * 360 + targetY}deg) rotateX(${extraSpins * 360 + targetX}deg)`;
  resultText.textContent = "Rolling...";

  setTimeout(() => {
    resultText.textContent = `You rolled a ${roll}!`;
    currentX = targetX;
    currentY = targetY;
    isRolling = false;
  }, 1000);
}

// --- SHAKE DETECTION LOGIC ---
function enableShake() {
  if (shakeEnabled) return; // Only enable once
  shakeEnabled = true;
  
  // Check if this is iOS Safari (requires explicit permission)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (isIOS && typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('devicemotion', handleMotion);
        }
      })
      .catch(console.error);
  } else {
    // Android and other devices don't need explicit permission prompts
    window.addEventListener('devicemotion', handleMotion);
  }
}

// Detect sharp movements using proper acceleration magnitude
function handleMotion(event) {
  const threshold = 25; // Adjusted threshold for proper shake detection
  const accel = event.accelerationIncludingGravity;
  
  if (!accel) return;

  // Calculate proper magnitude (Euclidean distance)
  const magnitude = Math.sqrt(accel.x * accel.x + accel.y * accel.y + accel.z * accel.z);
  
  // Debounce to prevent multiple rolls from single shake
  const now = Date.now();
  if (magnitude > threshold && (now - lastShakeTime) > SHAKE_DEBOUNCE) {
    lastShakeTime = now;
    rollDice();
  }
}

// --- EVENT LISTENERS ---
dice.addEventListener('click', () => {
  rollDice();
  // Enable shake detection on first interaction (deferred to avoid permission spam)
  if (!shakeEnabled) {
    setTimeout(enableShake, 100);
  }
});
