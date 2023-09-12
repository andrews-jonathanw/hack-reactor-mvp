//Power-Ups
export class PowerUpOrb {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // You can specify the type of power-up (e.g., "doubleBullets", "fasterShooting", "biggerBullets")
    this.radius = 10; // Adjust the radius as needed
    this.color = "blue"; // Adjust the color as needed
    this.active = true; // Set to false when collected by the player
  }

  draw(ctx) {
    if (this.active) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }
  }

  checkCollision(bullets) {
    if (this.active) {
      for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        const dx = bullet.x - this.x;
        const dy = bullet.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + bullet.radius) {
          // Player bullet collided with the power-up orb
          this.active = false; // Mark it as collected
          // Apply the power-up effect to the player here
          return true; // Indicate that a collision occurred
        }
      }
    }
    return false; // No collision
  }
}

export function applyPowerUpEffect(powerUpType) {
  switch (powerUpType) {
    case "doubleBullets":
      // Apply the double bullets power-up effect to the player
      player.enableDoubleBullets(); // You'll need to implement this function
      break;
    // Add cases for other power-up types if needed
  }
}