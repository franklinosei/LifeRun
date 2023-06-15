// restart game handler
function restartGame() {
  window.location.href = "gamemode.html";
}

// get and set gameover scores
document.getElementById("highestScore").textContent =
  localStorage.getItem("highestScore") ?? 0;

document.getElementById("currentScore").textContent =
  localStorage.getItem("currentScore") ?? 0;

document.getElementById("questionsAnswered").textContent =
  localStorage.getItem("questionsAnswered") ?? 0;
