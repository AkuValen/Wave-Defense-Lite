import { Enemy } from "../entities/enemy.js";
import { enemyData } from "./assets.js";

export function renderEnemy(game, ctx) {
  const activeEnemies = game.activeEnemies;

  activeEnemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color;

    ctx.beginPath();
    ctx.arc(enemy.pivotX, enemy.pivotY, enemy.size, 0, Math.PI * 2);

    ctx.fill();
  });
}

function findNextNode(game, enemy) {
  const mapData = game.mapData;
  const mapGrid = game.mapGrid;

  const currentR = Math.ceil(enemy.pivotY / mapData.nodeSize);
  const currentC = Math.ceil(enemy.pivotX / mapData.nodeSize);
  const currentNode = mapGrid[currentR - 1][currentC - 1];

  const neighborNode = [
    { r: currentNode.row - 1, c: currentNode.column },
    { r: currentNode.row, c: currentNode.column + 1 },
    { r: currentNode.row + 1, c: currentNode.column },
    { r: currentNode.row, c: currentNode.column - 1 },
  ];

  let nNode = [];

  const row = mapData.row;
  const column = mapData.column;

  for (let n of neighborNode) {
    if (n.r < 1 || n.r > row || n.c < 1 || n.c > column) {
      continue;
    }
    if (mapGrid[n.r - 1][n.c - 1].isOccupied) {
      continue;
    }

    nNode.push(mapGrid[n.r - 1][n.c - 1]);
  }

  const lowestScore = Math.min(...nNode.map((node) => node.gScore));

  nNode = nNode.filter((node) => node.gScore === lowestScore);

  const nextNode = nNode[Math.floor(Math.random() * nNode.length)];

  enemy.nextNode = nextNode;
}

let spawnCooldown;
let spawnRateEnemy;

export function spawnEnemy(game) {
  const activeEnemies = game.activeEnemies;

  const randIndex = Math.floor(Math.random());

  let i = 0;

  const spawnRateValue = Object.values(spawnRateEnemy);
  for (const rate of spawnRateValue) {
    if (randIndex <= rate) break;

    i++;
  }

  const spawnpoint = game.mapData.spawnpoint;

  const newEnemyData = enemyData[i];

  activeEnemies.push(new Enemy(game, newEnemyData, spawnpoint));
}

export function updateEnemy(game) {
  let activeEnemies = game.activeEnemies;
  const basepoint = game.mapData.basepoint;

  if (game.time.tick) {
    spawnCooldown--;

    if (spawnCooldown <= 0) {
      spawnEnemy(game);
      console.log("Spawn lalu cooldown");
      spawnCooldown = game.level.spawnInterval;
    }
  }

  // if (activeEnemies.length <= 0) return;

  activeEnemies.forEach((enemy) => {
    if (!enemy.nextNode) {
      findNextNode(game, enemy);
    }

    enemy.move();

    if (enemy.pivotX === basepoint.pivotX && enemy.pivotY === basepoint.pivotY) {
      enemy.hp = 0;
    }
  });

  game.activeEnemies = activeEnemies.filter((enemy) => enemy.hp > 0);
}

export function setEnemy(game) {
  spawnCooldown = 3;

  let totalRate = 0;
  Object.values(game.level.spawnRateVariant).forEach((value) => {
    totalRate += value;
  });

  spawnRateEnemy = {
    weakling: game.level.spawnRateVariant.weakling / totalRate,
    roamer: game.level.spawnRateVariant.roamer / totalRate,
    swift: game.level.spawnRateVariant.swift / totalRate,
    tank: game.level.spawnRateVariant.tank / totalRate,
  };

  console.log("Spawnrate: ", spawnRateEnemy);
}
