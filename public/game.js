import {
  alienWidth,
  alienHeight,
  numRows,
  numCols,
  alienSpeedX,
  alienSpeedY,
  alienMatrix,
  initializeRandomAliens,
  Alien,
  Alien1HP,
  Alien2HP,
  alienBullets,
  resetAliens,
} from './alien.js';

import {
  canvas,
  ctx,
  draw,
  animationId,
} from './main.js';

console.log('UserId:', userId);

export let gameOver = false;
export let win = false;
export let isPaused = false;
export let round = 20;
export let score = 0;
export let lives = 3;
export const powerUpOrbs = [];

import {
  player,
  moveSpaceship,
  spaceshipHeight,
  spaceshipWidth,
} from './player.js';

// Bullets
const bulletWidth = 2;
const bulletHeight = 10;
const bullets = [];
const bulletSpeed = 5;

export function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 380, 30);
}

export function drawRound() {
ctx.font = "20px Arial";
ctx.fillStyle = "white";
ctx.fillText("Round: " + round, 10, 30);
}

export function drawLives() {
ctx.font = "20px Arial";
ctx.fillStyle = "white";
ctx.fillText("Lives: " + lives, 10 , 60);
}

export function drawSpaceship() {
ctx.beginPath();
ctx.rect(player.spaceshipX, player.spaceshipY, player.width, player.height);
ctx.fillStyle = "white";
ctx.fill();
ctx.closePath();
}

export function drawAliens() {
for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < numCols; col++) {
    const alien = alienMatrix[row][col];
    if (alien.alive) {
      ctx.beginPath();
      ctx.rect(alien.x, alien.y, alienWidth, alienHeight);
      ctx.fillStyle = alien.color; // Use the color property of the alien object
      ctx.fill();
      ctx.closePath();
    }
  }
}
}

export function drawBullet(bullet) {
  ctx.beginPath();
  ctx.rect(bullet.x, bullet.y, bulletWidth, bulletHeight);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

export function collisionDetection() {
for (let i = 0; i < player.bullets.length; i++) {
  const bullet = player.bullets[i];
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const alien = alienMatrix[row][col];
      if (alien.alive) {
        if (
          bullet.x < alien.x + alienWidth &&
          bullet.x + bulletWidth > alien.x &&
          bullet.y < alien.y + alienHeight &&
          bullet.y + bulletHeight > alien.y
        ) {
          // Collision detected
          if (alien.hp === 1) {
            alien.destroy();
            score += alien.pointValue;
          } else if (alien.hp === 2) {
            // If it's a 2HP alien, reduce its HP by 1
            alien.hp -= 1;
            alien.color = "green";
          }
          // Remove the bullet
          player.bullets.splice(i, 1);
        }
      }
    }
  }
}
for (let i = alienBullets.length - 1; i >= 0; i--) {
  const alienBullet = alienBullets[i];
  if (
    alienBullet.x < player.spaceshipX + player.width &&
    alienBullet.x + bulletWidth > player.spaceshipX &&
    alienBullet.y < canvas.height - player.height &&
    alienBullet.y + bulletHeight > canvas.height - player.height
  ) {
    handlePlayerHit();
    alienBullets.splice(i, 1);
  }
}
}

export function handlePlayerHit() {
lives -= 1;
}

export function checkGameOver() {
if (lives <= 0) {
  resetAliens();
  gameOver = true;
  return;
}
for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
        const alien = alienMatrix[row][col];
        if (alien.alive && alien.y + alienHeight >= canvas.height - spaceshipHeight) {
            // Reset alien positions when game over
            resetAliens();
            gameOver = true;
            return;
        }
    }
}

// Additional condition: If all aliens are destroyed (win condition met), set game over to true
if (win) {
    gameOver = true;
}
}


export function checkWin() {
let allAliensDestroyed = true;

for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
        if (alienMatrix[row][col].alive) {
            allAliensDestroyed = false;
            break;
        }
    }
    if (!allAliensDestroyed) {
        break;
    }
}

if (allAliensDestroyed) {
    win = true;
}
}

export function startNewRound() {
console.log("Starting next round.");
// Reset game state
gameOver = false;
win = false;
round++;
player.bullets.length = 0;
alienBullets.length = 0;
for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < numCols; col++) {
    alienMatrix[row][col].alive = false;
  }
}
initializeRandomAliens(round);
draw();
}

export function restartGame() {
console.log("Restarting the game.");
// Reset game state
gameOver = false;
score = 0;
lives = 3;
round = 1;
win = false;
player.bullets.length = 0;
alienBullets.length = 0;
powerUpOrbs.length = 0;
for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < numCols; col++) {
    alienMatrix[row][col].alive = false;
  }
}

initializeRandomAliens(round);
  draw(); // Restart the game loop by calling draw()
}


export function drawGameOver() {
  currentButtonCallback = restartGame; // Set the current button action
  drawMessage("Game Over", "Restart", "green");
}

export function drawWinMessage() {
  currentButtonCallback  = startNewRound; // Set the current button action
  drawMessage("You Win!", "Continue", "blue");
}


let currentButtonCallback = null; // Variable to store the current button action

// Define the click event handler function
export function handleButtonClick(event) {
  if (!gameOver) {
    return;
  }
  const clickX = event.clientX - canvas.getBoundingClientRect().left;
  const clickY = event.clientY - canvas.getBoundingClientRect().top;
  if (
    clickX >= canvas.width / 2 - 50 &&
    clickX <= canvas.width / 2 + 50 &&
    clickY >= canvas.height / 2 + 20 &&
    clickY <= canvas.height / 2 + 60
  ) {
    if (currentButtonCallback) {
      if(gameOver && currentButtonCallback === restartGame) {
        sendScoreToAPI(score);
      }
      currentButtonCallback(); // Call the current button action
    }
  }
}

function sendScoreToAPI(score) {
  const apiUrl = 'http://localhost:5000/api/submitScore';

  axios.post(apiUrl, { userId, score })
    .then((response) => {
      console.log('Score sent to API successfully:', response.data);
    })
    .catch((error) => {
      console.error('Error sending score to API:', error);
    });
}

// Add an event listener to toggle pause when the Escape key is pressed
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    isPaused = !isPaused;
    if (!isPaused) {
      // Resume the game loop
      let animationId = requestAnimationFrame(draw);
    }
  }
});


export function drawMessage(text, buttonLabel, buttonColor) {
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.font = "30px Arial";
ctx.fillStyle = text === "Game Over" ? "red" : "green";

// Calculate the text width to center it horizontally
const textWidth = ctx.measureText(text).width;
const textX = (canvas.width - textWidth) / 2;

// Draw the score text centered
ctx.fillText("Score: " + score, textX, canvas.height / 2 - 50);

// Draw the "Game Over" or "You Win!" text centered
ctx.fillText(text, textX, canvas.height / 2 - 15);

// Calculate button width to center it horizontally
const buttonWidth = 100;
const buttonX = (canvas.width - buttonWidth) / 2;

// Draw restart/continue button centered
ctx.fillStyle = buttonColor;
ctx.fillRect(buttonX, canvas.height / 2 + 20, buttonWidth, 40);
ctx.font = "20px Arial";
ctx.fillStyle = "white";

// Calculate the button label width to center it on the button
const buttonLabelWidth = ctx.measureText(buttonLabel).width;
const buttonLabelX = (canvas.width - buttonLabelWidth) / 2;

ctx.fillText(buttonLabel, buttonLabelX, canvas.height / 2 + 45);
}