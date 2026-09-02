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

export function spawnEnemy(game) {
  const activeEnemies = game.activeEnemies;

  const randI = Math.floor(Math.random() * enemyData.length);
  const randEnemy = enemyData[randI];

  const spawnpoint = game.mapData.spawnpoint;

  game.activeEnemies.push(new Enemy(game, randEnemy, spawnpoint));
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

  // enemy.setNextNode(nextNode);
  enemy.nextNode = nextNode;
}

export function updateEnemy(game) {
  const activeEnemies = game.activeEnemies;
  const basepoint = game.mapData.basepoint;

  activeEnemies.forEach((enemy) => {
    if (!enemy.nextNode) {
      findNextNode(game, enemy);
    }

    enemy.move();

    if (enemy.pivotX === basepoint.pivotX && enemy.pivotY === basepoint.pivotY) {
      enemy.hp = 0;
    }
  });

  game.activeEnemies = game.activeEnemies.filter((enemy) => enemy.hp > 0);
}
