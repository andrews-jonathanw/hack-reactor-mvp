let gameTime = 0;
let timerInterval;

function startTimer() {
  // Start the timer
  timerInterval = setInterval(() => {
    gameTime += 1; // Increase gameTime by 1 second
  }, 1000); // Update the timer every 1000 milliseconds (1 second)
}

function stopTimer() {
  // Stop the timer
  clearInterval(timerInterval);
}

function resetTimer() {
  // Reset the timer
  gameTime = 0;
}

export function getGameTime() {
  // Get the current game time
  return gameTime;
}

export { startTimer, stopTimer, resetTimer };
