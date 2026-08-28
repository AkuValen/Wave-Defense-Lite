import { configGameData } from "./core/assets.js";
import { newMap, drawMap, nodeSize } from "./map/map.js";
import { spawnEnemy } from "./entities/enemy.js";

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

let activeEnemies = [];
let activeTowers = [];

let frameCounter = 0;

function updateGame() {
  if (activeEnemies.length <= 0) {
    if (frameCounter % 60 == 0) console.log(`Tidak ada lawan saat ini`);
    return;
  }

  for (let enemy of activeEnemies) {
    enemy.update();

    if (frameCounter % 60 == 0) {
      let enemyR = Math.ceil(enemy.pivotY / nodeSize);
      let enemyC = Math.ceil(enemy.pivotX / nodeSize);

      console.log(`Posisi musuh berada di r${enemyR}c${enemyC}`);
    }
  }

  for (let tower of activeTowers) {
    tower.shoot();
  }

  activeEnemies = activeEnemies.filter((enemy) => enemy.hp > 0);
}

function renderGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMap(canvas);

  if (activeEnemies.length <= 0) {
    return;
  }

  for (let enemy of activeEnemies) {
    ctx.fillStyle = enemy.color;

    ctx.beginPath();
    ctx.arc(enemy.pivotX, enemy.pivotY, enemy.size, 0, Math.PI * 2);

    ctx.fill();
  }
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

  spawnEnemy(activeEnemies);

  gameLoop();
}

configGameData().then(() => {
  startGame();
});
