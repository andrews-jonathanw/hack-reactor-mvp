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
  gameOver,
  win,
  isPaused,
  round,
  score,
  lives,
  powerUpOrbs,
} from './game.js';

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

export function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Only update and render the game if it's not paused
  if (!isPaused) {
    // Your game logic here


    checkWin();

    if (gameOver) {
      if (win) {

        drawWinMessage();
      } else {

        drawGameOver();
      }
      return;
    }

    drawSpaceship();
    drawAliens();
    drawScore();
    drawRound();
    drawLives();

    player.drawBullets(ctx);
    player.updateBullets();

    for (let i = 0; i < alienBullets.length; i++) {
      const alienBullet = alienBullets[i];
      drawBullet(alienBullet);
      alienBullet.y += alienBullet.speed; // You may need to adjust the speed accordingly
    }
    powerUpOrbs.forEach((orb, index) => {
      orb.draw(ctx); // Draw the power-up orb

      // Check if the power-up orb collides with any player bullets
      const collisionIndex = orb.checkCollision(bullets);

      if (collisionIndex !== -1) {
        // Apply the power-up effect to the player (you can customize this logic)
        applyPowerUpEffect(orb.type); // Pass the type of power-up as needed

        // Remove the collided power-up orb from the array
        powerUpOrbs.splice(index, 1);
      }
    });

    collisionDetection();
    checkGameOver(); // Check for game over condition
    moveAliens();
    makeAllAliensFire();


    moveSpaceship();

    animationId = requestAnimationFrame(draw);
  } else {
    // Render the current game state (e.g., the last frame) without updating it
    drawSpaceship();
    drawAliens();
    drawScore();
    drawRound();
    drawLives();
    player.drawBullets(ctx);
    player.updateBullets();

    for (let i = 0; i < alienBullets.length; i++) {
      const alienBullet = alienBullets[i];
      drawBullet(alienBullet);
      alienBullet.y += alienBullet.speed; // You may need to adjust the speed accordingly
    }
    powerUpOrbs.forEach((orb, index) => {
      orb.draw(ctx); // Draw the power-up orb

      // Check if the power-up orb collides with any player bullets
      const collisionIndex = orb.checkCollision(bullets);

      if (collisionIndex !== -1) {
        // Apply the power-up effect to the player (you can customize this logic)
        applyPowerUpEffect(orb.type); // Pass the type of power-up as needed

        // Remove the collided power-up orb from the array
        powerUpOrbs.splice(index, 1);
      }
    });
    // Add the "Paused" text
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Paused", canvas.width / 2 - 50, canvas.height / 2 - 15);
  }
}




function initializeGame() {
  // Remove any existing click event listeners on the canvas
  canvas.removeEventListener("click", handleButtonClick);

  // Add a click event listener to handle button clicks
  canvas.addEventListener("click", handleButtonClick);

  // Initialize the game
  initializeRandomAliens(round);
  animationId = requestAnimationFrame(draw);
}

initializeGame();