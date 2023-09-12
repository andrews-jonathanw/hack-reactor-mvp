import { canvas, ctx, matrixX, matrixY } from "./main.js";
import { PowerUpOrb, applyPowerUpEffect } from "./powerups.js";
import { powerUpOrbs } from "./game.js"

// Aliens
export const alienWidth = 20;
export const alienHeight = 20;
export const numRows = 5; // Number of rows of aliens
export const numCols = 10; // Number of columns of aliens
export const alienSpeedX = 2; // Horizontal movement speed
export const alienSpeedY = 0.08; // Vertical descent speed
export const alienMatrix = [];



// Bullets
const bulletWidth = 2;
const bulletHeight = 10;
const bullets = [];
const bulletSpeed = 5;

export class Alien {
  constructor(x, y, hp, color, directionX = 0, directionY = 0, width = 20, height = 20) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.hp = hp;
    this.color = color;
    this.alive = true;
    this.directionX = directionX;
    this.directionY = directionY;
  }
  destroy() {
    this.alive = false; // Mark the alien as destroyed

    // Add logic to determine if a power-up orb should be created
    const shouldDropPowerUp = Math.random() < 1; // Adjust the probability as needed

    if (shouldDropPowerUp) {
      // Create a PowerUpOrb instance at the alien's position
      const powerUpOrbWidth = 20;
      const powerUpOrbHeight = 20;
      const powerUpOrb = new PowerUpOrb(this.x, this.y, powerUpOrbWidth, powerUpOrbHeight, "blue");
      powerUpOrbs.push(powerUpOrb); // Add the power-up orb to an array
    }
  }
}

export class Alien1HP extends Alien {
  constructor(x, y, directionX = 0, directionY = 0, width = 20, height = 20) {
    super(x, y, 1, "green", directionX, directionY, width, height);
    this.pointValue = 25;
    // Add any additional properties or methods specific to Alien1HP.
  }
}

export const alienBullets = [];

export class Alien2HP extends Alien {
  constructor(x, y, directionX = 0, directionY = 0, width = 20, height = 20) {
    super(x, y, 2, "orange", directionX, directionY, width, height);
    this.pointValue = 100;
    this.isFiring = false;
    this.canFire = false; // Add a flag to control firing
    this.fireInterval = this.getRandomFireInterval();
    this.fireDelay = 2000; // Delay in milliseconds (2 seconds)
  }

  getRandomFireInterval() {
    const maxFireInterval = 5000;
    const minFireInterval = 2000;
    return Math.random() * (maxFireInterval - minFireInterval) + minFireInterval;
  }

  fire() {
    if (!this.isFiring && this.alive && this.canFire) { // Check if the alien is alive and can fire
      const bulletX = this.x + this.width / 2 - bulletWidth / 2;
      const bulletY = this.y + this.height;
      const bullet = {
        x: bulletX,
        y: bulletY,
        width: bulletWidth,
        height: bulletHeight,
        speed: 2, // Use the alien bullet speed
        color: "white"
      };
      alienBullets.push(bullet); // Push the bullet to the alienBullets array
      this.isFiring = true;
      setTimeout(() => {
        this.isFiring = false;
        this.fireInterval = this.getRandomFireInterval();
        this.fire();
      }, this.fireInterval);
    }
  }

  startFiringDelay() {
    // Disable firing for the specified delay duration
    this.canFire = false;
    setTimeout(() => {
      this.canFire = true; // Enable firing after the delay
    }, this.fireDelay);
  }
};


export function moveAliens() {
  let shouldChangeDirection = false;

  for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
          const alien = alienMatrix[row][col];
          if (alien.alive) {
              if (alien.directionX === 0) {
                  // Randomly set the initial direction (left or right) if it's not already set
                  alien.directionX = Math.random() < 0.5 ? -1 : 1;
              }

              alien.x += alienSpeedX * alien.directionX;
              alien.y += alienSpeedY * alien.directionY;

              // Check if an alien reaches the canvas edge
              if (alien.x + alienWidth >= canvas.width) {
                  shouldChangeDirection = true;
              } else if (alien.x <= 0) {
                  shouldChangeDirection = true;
              }

              if (alien.y + alienHeight >= canvas.height) {
                  alien.alive = false;
              }

              // Add console logs after the update

          }
      }
  }

  if (shouldChangeDirection) {
      for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
              const alien = alienMatrix[row][col];
              if (alien.alive) {
                  alien.directionX *= -1;
                  alien.y += alienHeight;
              }
          }
      }
  }
};

export function initializeRandomAliens(round) {
  const totalAliens = Math.floor(10 + (round - 1) * 1.25);
  const numAlien1HP = Math.floor(totalAliens * 0.7); // 70% 1HP aliens
  const numAlien2HP = totalAliens - numAlien1HP; // Remaining are 2HP aliens

  const availablePositions = [];

  // Calculate the maximum allowed y-position for alien spawn
  const maxY = matrixY + 10;

  // Calculate the maximum allowed x-position for alien spawn
  const maxX = matrixX + 10;

  // Calculate the vertical spacing between rows of aliens
  const rowSpacing = alienHeight + 10;

  // Calculate the horizontal spacing between columns of aliens
  const colSpacing = alienWidth + 10;

  // Generate a single random direction for the entire group (left or right)
  const initialDirectionX = Math.random() < 0.5 ? -1 : 1;
  const initialDirectionY = 0; // No vertical movement initially

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (!alienMatrix[row][col].alive) {
        availablePositions.push({ row, col });
      }
    }
  }

  // Initialize Alien1HP
  for (let i = 0; i < numAlien1HP; i++) {
    if (availablePositions.length === 0) {
      break; // No more available positions
    }

    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const { row, col } = availablePositions.splice(randomIndex, 1)[0];

    // Calculate the initial y-position within the specified range
    const initialY = maxY + row * rowSpacing;

    // Calculate the initial x-position within the specified range
    const initialX = maxX + col * colSpacing;

    const alien = new Alien1HP(initialX, initialY, initialDirectionX, initialDirectionY);
    alien.alive = true; // Set the alien as alive
    alienMatrix[row][col] = alien; // Update the game's data structure
  }

  // Initialize Alien2HP
  for (let i = 0; i < numAlien2HP; i++) {
    if (availablePositions.length === 0) {
      break; // No more available positions
    }

    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const { row, col } = availablePositions.splice(randomIndex, 1)[0];

    // Calculate the initial y-position within the specified range
    const initialY = maxY + row * rowSpacing;

    // Calculate the initial x-position within the specified range
    const initialX = maxX + col * colSpacing;

    const alien = new Alien2HP(initialX, initialY, initialDirectionX, initialDirectionY);
    alien.alive = true; // Set the alien as alive
    alien.startFiringDelay();
    alienMatrix[row][col] = alien; // Update the game's data structure
  }
}

export function makeAllAliensFire() {
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const alien = alienMatrix[row][col];
      if (alien instanceof Alien2HP && alien.alive) {
        // Only make Alien2HP instances fire
        alien.fire();
      }
    }
  }
}

export function resetAliens() {
  for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
          alienMatrix[row][col].x = matrixX + col * (alienWidth + 10);
          alienMatrix[row][col].y = matrixY + row * (alienHeight + 10);
      }
  }
}