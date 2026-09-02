const waveUi = document.getElementById("wave");
const heartUi = document.getElementById("heart");
const goldUi = document.getElementById("gold");

export function printUi(game) {
  if (waveUi) {
    wave.textContent = game.level.wave;
  }
  if (heartUi) {
    heartUi.textContent = game.player.heart;
  }
  if (goldUi) {
    goldUi.textContent = game.player.gold;
  }
}
