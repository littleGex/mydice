const dice = document.getElementById('dice');
const resultText = document.getElementById('result');

let currentX = 0;
let currentY = 0;

dice.addEventListener('click', () => {
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

  // Keep adding to the rotation so it always spins forward
  currentX += (extraSpins * 360) + targetX;
  currentY += (extraSpins * 360) + targetY;

  dice.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
  resultText.textContent = "Rolling...";

  setTimeout(() => {
    resultText.textContent = `You rolled a ${roll}!`;
  }, 1000);
});
