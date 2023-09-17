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
  moveAliens,
  makeAllAliensFire,
} from './alien.js';

import {
  keysState,
} from './input.js';

import { player, moveSpaceship, bullets } from './player.js';
import { applyPowerUpEffect } from "./powerups.js";


import {
  drawScore,
  drawRound,
  drawLives,
  drawSpaceship,
  drawAliens,
  drawBullet,
  drawTimer,
  collisionDetection,
  handlePlayerHit,
  checkGameOver,
  checkWin,
  startNewRound,
  restartGame,
  drawGameOver,
  drawWinMessage,
  drawMessage,
  handleButtonClick,
  gameState,
  gameOver,
  win,
  isPaused,
  round,
  score,
  lives,
  powerUpOrbs,
} from './game.js';

import { startTimer, stopTimer, resetTimer, getGameTime } from './timer.js';

let backgroundImage;
backgroundImage = new Image();
backgroundImage.src = 'space-2.jpg';
export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

// Adjust canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Calculate the starting position of the matrix to center it
const matrixWidth = numCols * (alienWidth + 10) - 10;
const matrixHeight = numRows * (alienHeight + 10) - 10;
export const matrixX = (canvas.width - matrixWidth) / 2;
export const matrixY = 50; // Adjust this value to set the vertical position

export let animationId;

for (let row = 0; row < numRows; row++) {
    alienMatrix[row] = [];
    for (let col = 0; col < numCols; col++) {
        alienMatrix[row][col] = {
            x: matrixX + col * (alienWidth + 10),
            y: matrixY + row * (alienHeight + 10),
            alive: false, // Start with no aliens alive
            directionX: 1, // 1 for right, -1 for left
            directionY: 0, // 0 for no vertical movement
        };
    }
}

export function drawMenu(ctx, backgroundImage) {
  // Draw the background image
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";

  // Title
  ctx.font = "42px Arial";
  let text = "Space Wars";
  let textX = canvas.width / 2 - ctx.measureText(text).width / 2;
  ctx.fillText(text, textX, canvas.height / 2 - 100);

  // Draw the instructions
  ctx.font = "20px Arial";
  text = "Instructions:";
  textX = canvas.width / 2 - ctx.measureText(text).width / 2;
  ctx.fillText(text, textX, canvas.height / 2 - 30);

  text = "Arrow Keys to Move";
  textX = canvas.width / 2 - ctx.measureText(text).width / 2;
  ctx.fillText(text, textX, canvas.height / 2 + 10);

  // Drawing custom left arrow
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 40, canvas.height / 2 + 40);
  ctx.lineTo(canvas.width / 2 - 30, canvas.height / 2 + 30);
  ctx.lineTo(canvas.width / 2 - 30, canvas.height / 2 + 50);
  ctx.closePath();
  ctx.fill();

  // Drawing custom right arrow
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 + 40, canvas.height / 2 + 40);
  ctx.lineTo(canvas.width / 2 + 30, canvas.height / 2 + 30);
  ctx.lineTo(canvas.width / 2 + 30, canvas.height / 2 + 50);
  ctx.closePath();
  ctx.fill();

  // Instructions for firing
  ctx.font = "20px Arial";
  text = "Space bar to fire";
  textX = canvas.width / 2 - ctx.measureText(text).width / 2;
  ctx.fillText(text, textX, canvas.height / 2 + 80);


  // For "Press 'Space' to Start"
  ctx.font = "32px Arial";
  text = "Press 'Space' to Start";
  textX = canvas.width / 2 - ctx.measureText(text).width / 2;
  ctx.fillText(text, textX, canvas.height / 2 + 160);
}



export function drawPausedState() {
  // Render the game in a paused state
  drawSpaceship();
  drawAliens();
  drawScore();
  drawRound();
  drawLives();
  drawTimer();
  player.drawBullets(ctx);
  player.updateBullets();

  for (let i = 0; i < alienBullets.length; i++) {
    const alienBullet = alienBullets[i];
    drawBullet(alienBullet);
    alienBullet.y += alienBullet.speed;
  }
  powerUpOrbs.forEach((orb, index) => {
    orb.draw(ctx);
    const collisionIndex = orb.checkCollision(bullets);
    if (collisionIndex !== -1) {
      applyPowerUpEffect(orb.type);
      powerUpOrbs.splice(index, 1);
    }
  });

  // Draw the pause menu with extended rectangles
  const pauseMenuWidth = canvas.width / 2 + 100;
  const pauseMenuX = canvas.width / 2 - pauseMenuWidth / 2;

  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(pauseMenuX, canvas.height / 4, pauseMenuWidth, canvas.height / 2);

  // Pause menu text
  ctx.font = "24px Arial";
  ctx.fillStyle = "white";

  // Calculate the x-coordinate for centered text
  const textWidth = ctx.measureText("Paused Menu").width;
  const textX = canvas.width / 2 - textWidth / 2;

  ctx.fillText("Paused Menu", textX, canvas.height / 2 - 30);

  // Restart button
  const buttonWidth = 160;
  const buttonX = canvas.width / 2 - buttonWidth / 2;
  const buttonY = canvas.height / 2;

  ctx.fillStyle = "blue";
  ctx.fillRect(buttonX, buttonY, buttonWidth, 40);
  ctx.fillStyle = "white";

  // Calculate the x-coordinate for centered text within the button
  const restartText = "Restart";
  const restartTextWidth = ctx.measureText(restartText).width;
  const restartTextX = canvas.width / 2 - restartTextWidth / 2;

  ctx.fillText(restartText, restartTextX, buttonY + 25);

  // Main menu button
  ctx.fillStyle = "red";
  ctx.fillRect(buttonX, buttonY + 60, buttonWidth, 40);
  ctx.fillStyle = "white";

  // Calculate the x-coordinate for centered text within the button
  const mainMenuText = "Main Menu";
  const mainMenuTextWidth = ctx.measureText(mainMenuText).width;
  const mainMenuTextX = canvas.width / 2 - mainMenuTextWidth / 2;

  ctx.fillText(mainMenuText, mainMenuTextX, buttonY + 85);
}

const buttonWidth = 160;
const buttonX = canvas.width / 2 - buttonWidth / 2;
const buttonY = canvas.height / 2;
const buttonHeight = 40;

// Event listener for canvas clicks
canvas.addEventListener("click", function (event) {
  if (isPaused) {
    const clickX = event.clientX - canvas.getBoundingClientRect().left;
    const clickY = event.clientY - canvas.getBoundingClientRect().top;

    // Check if the click is within the boundaries of the "Restart" button
    if (
      clickX >= buttonX &&
      clickX <= buttonX + buttonWidth &&
      clickY >= buttonY &&
      clickY <= buttonY + buttonHeight
    ) {
      restartGame();
    }

    // Check if the click is within the boundaries of the "Main Menu" button
    if (
      clickX >= buttonX &&
      clickX <= buttonX + buttonWidth &&
      clickY >= buttonY + 60 && // Assuming a vertical spacing of 60 between buttons
      clickY <= buttonY + 60 + buttonHeight
    ) {
      window.location.reload();
    }
  }
});


export function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (gameState === "menu") {
    // Draw the menu when the game is in "menu" state
    drawMenu(ctx, backgroundImage);
  } else if (!isPaused) {
    // Game logic for when the game is not paused

    checkWin();

    if (gameOver) {
      if (win) {
        drawWinMessage();
      } else {
        drawGameOver();
      }
      return;
    }

    // Your existing game rendering logic
    drawSpaceship();
    drawAliens();
    drawScore();
    drawRound();
    drawLives();
    drawTimer();
    player.drawBullets(ctx);
    player.updateBullets();

    for (let i = 0; i < alienBullets.length; i++) {
      const alienBullet = alienBullets[i];
      drawBullet(alienBullet);
      alienBullet.y += alienBullet.speed;
    }
    powerUpOrbs.forEach((orb, index) => {
      orb.draw(ctx);
      const collisionIndex = orb.checkCollision(bullets);
      if (collisionIndex !== -1) {
        applyPowerUpEffect(orb.type);
        powerUpOrbs.splice(index, 1);
      }
    });

    collisionDetection();
    checkGameOver();
    moveAliens();
    makeAllAliensFire();
    moveSpaceship();

    animationId = requestAnimationFrame(draw);
  } else {
    // Render the current game state (paused) without updating it
    drawPausedState();
  }
}

export function initializeGame() {
  // Remove any existing click event listeners on the canvas
  canvas.removeEventListener("click", handleButtonClick);
  // Add a click event listener to handle button clicks
  canvas.addEventListener("click", handleButtonClick);

  // Initialize the game

  animationId = requestAnimationFrame(draw);
}

initializeRandomAliens(round);
initializeGame();
