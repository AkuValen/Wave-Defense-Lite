import { configGameData } from "./core/assets.js";
import { newMap, drawMap } from "./map/map.js";
import { enemies, spawnEnemy, updateEnemies } from "./entities/enemy.js";

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

let frameCounter = 0;

function updateGame() {
  if (enemies.length <= 0) {
    if (frameCounter % 60 == 0) console.log(`Tidak ada lawan saat ini`);
    return;
  }

  enemies.forEach((enemy, index) => {
    enemy.pivotX += enemy.speed;

    if (enemy.pivotX > canvas.width) {
      enemy.hp = 0;
    }

    if (frameCounter % 60 == 0) {
      console.log(`enemy${index + 1} pada x${enemy.pivotX}y${enemy.pivotY}`);
    }
  });

  updateEnemies();
}

function renderGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMap(canvas);

  if (enemies.length <= 0) {
    return;
  }

  enemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color;
    ctx.beginPath();
    ctx.arc(enemy.pivotX, enemy.pivotY, enemy.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function gameLoop() {
  frameCounter++;

  updateGame();
  renderGame();

  requestAnimationFrame(gameLoop);
}

function startGame() {
  // newMap(gridNode, canvas);
  newMap(canvas);

  spawnEnemy();

  gameLoop();
}

configGameData().then(() => {
  startGame();
});
