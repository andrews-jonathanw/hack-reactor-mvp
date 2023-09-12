import { canvas, ctx, matrixX, matrixY } from "./main.js";
import { keysState } from "./input.js"
// Player object
export const spaceshipWidth = 40;
export const spaceshipHeight = 20;

// Bullets
const bulletWidth = 2;
const bulletHeight = 10;
export const bullets = [];
const bulletSpeed = 5;

export const player = {
  spaceshipX: (800 - spaceshipWidth) / 2,
  spaceshipY: 600 - spaceshipHeight,
  width: spaceshipWidth,
  height: spaceshipHeight,
  speed: 5,
  shootDoubleBullets: false, // Add the property to track the "double bullets" power-up
  bullets: [],
  firingTimer: null,
  lastShotTime: 0,
  shootingInterval: 100, // Adjust as needed

  moveLeft() {
    if (keysState.ArrowLeft) {
      this.x -= this.speed;
      if (this.x < 0) {
        this.x = 0;
      }
    }
  },

  moveRight() {
    if (keysState.ArrowRight) {
      this.x += this.speed;
      if (this.x + this.width > canvas.width) {
        this.x = canvas.width - this.width;
      }
    }
  },

  startFiring() {
    this.firingTimer = setInterval(() => {
      this.fireBullet();
    }, this.shootingInterval);
  },

  stopFiring() {
    clearInterval(this.firingTimer);
    this.firingTimer = null;
  },

  fireBullet() {
    const currentTime = Date.now();
    if (currentTime - this.lastShotTime > this.shootingInterval) {
      const bulletX = this.spaceshipX + this.width / 2 - bulletWidth / 2;
      const bulletY = canvas.height - this.height;

      // Create the first bullet
      const bullet1 = {
        x: bulletX,
        y: bulletY,
      };

      // Push the first bullet into the bullets array
      this.bullets.push(bullet1);

      // Check if the "double bullets" power-up is active
      if (this.shootDoubleBullets) {
        // Create the second bullet, adjusted slightly to the left
        const bullet2 = {
          x: bulletX - 10, // Adjust the horizontal position as needed
          y: bulletY,
        };

        // Push the second bullet into the bullets array
        this.bullets.push(bullet2);
      }

      this.lastShotTime = currentTime;
    }
  },

  enableDoubleBullets() {
    this.shootDoubleBullets = true;
  },

  disableDoubleBullets() {
    this.shootDoubleBullets = false;
  },

  drawBullets(ctx) {
    for (let i = 0; i < this.bullets.length; i++) {

      const bullet = this.bullets[i];
      ctx.fillStyle = "white";
      ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
    }
  },

  updateBullets() {
    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];
      bullet.y -= bulletSpeed;

      // Remove bullets that go off-screen
      if (bullet.y < 0) {
        this.bullets.splice(i, 1);
        i--;
      }
    }
  },
};

export function moveSpaceship() {
  if (keysState.ArrowLeft) {
    player.spaceshipX -= player.speed;
    if (player.spaceshipX < 0) {
      // Wrap around to the right side of the canvas
      player.spaceshipX = canvas.width - player.width;
    }
  }
  if (keysState.ArrowRight) {
    player.spaceshipX += player.speed;
    if (player.spaceshipX > canvas.width - player.width) {
      // Wrap around to the left side of the canvas
      player.spaceshipX = 0;
    }
  }
}