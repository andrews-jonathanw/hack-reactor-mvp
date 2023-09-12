// Keys state
export const keysState = {
  ArrowLeft: false,
  ArrowRight: false,
  Space: false,
};

import { player, moveSpaceship } from './player.js';



document.addEventListener("keydown", (event) => {
  if (event.key in keysState) {
    keysState[event.key] = true;
  }
  if (event.key === " ") {
    event.preventDefault(); // Prevent the spacebar from scrolling the page
    if (!player.firingTimer) { // Check player's firingTimer property
      player.startFiring(); // Call the player's startFiring method
    }
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key in keysState) {
    keysState[event.key] = false;
  }
  if (event.key === " ") {
    player.stopFiring(); // Call the player's stopFiring method
  }
});


