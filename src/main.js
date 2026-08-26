const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

import { newMap, drawMap, spawnpoint, basepoint } from "./map/map.js";

// setCanvasArea();
// window.addEventListener("resize", setCanvasArea);

const gridNode = {
  row: 10,
  column: 10,
};
newMap(gridNode, canvas);

// function setCanvasArea() {
//   80% dari lebar device
//   let maxWidth = window.innerWidth * 0.8;
// }

const enemy = {
  pivotX: spawnpoint.pivotX,
  pivotY: spawnpoint.pivotY,
  size: 20,
  speed: 1,
  color: "#d06eb3",
};

function updateGame() {
  enemy.pivotX += enemy.speed;

  if (frameCounter % 60 == 0) {
    console.log(enemy.pivotX, enemy.pivotY);
  }
}

function renderGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMap(canvas);

  ctx.fillStyle = enemy.color;
  ctx.fillRect(
    enemy.pivotX - enemy.size / 2,
    enemy.pivotY - enemy.size / 2,
    enemy.size,
    enemy.size,
  );
}

let frameCounter = 0;

function gameLoop() {
  frameCounter++;

  updateGame();
  renderGame();

  requestAnimationFrame(gameLoop);
}

gameLoop();
