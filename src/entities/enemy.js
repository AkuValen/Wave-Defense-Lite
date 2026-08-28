import { nodeSize, map, mapGrid, spawnpoint, basepoint } from "../map/map.js";

export let enemies = [];

export class Enemy {
  constructor(data) {
    this.hp = data.hp;
    this.speed = data.speed;

    this.size = data.size;
    this.color = data.color;

    this.pivotX = data.pivotX;
    this.pivotY = data.pivotY;

    this.nextNode = "";

    this.findNextNode();
  }

  destroy() {
    this.hp = 0;
  }

  findNextNode() {
    const currentR = Math.ceil(this.pivotY / nodeSize);
    const currentC = Math.ceil(this.pivotX / nodeSize);
    const currentNode = mapGrid[currentR - 1][currentC - 1];

    const neighborNode = [
      { r: currentNode.row - 1, c: currentNode.column },
      { r: currentNode.row, c: currentNode.column + 1 },
      { r: currentNode.row + 1, c: currentNode.column },
      { r: currentNode.row, c: currentNode.column - 1 },
    ];

    let nNode = [];

    for (let n of neighborNode) {
      if (n.r < 1 || n.r > map.row || n.c < 1 || n.c > map.column) {
        continue;
      }

      nNode.push(mapGrid[n.r - 1][n.c - 1]);
    }

    const lowestScore = Math.min(...nNode.map((node) => node.gScore));

    nNode = nNode.filter((node) => node.gScore === lowestScore);

    this.nextNode = nNode[Math.floor(Math.random() * nNode.length)];
  }

  move() {
    if (!this.nextNode) {
      return;
    }

    const targetPivotX = this.nextNode.column * nodeSize - nodeSize / 2;
    const targetPivotY = this.nextNode.row * nodeSize - nodeSize / 2;

    this.pivotX += Math.sign(targetPivotX - this.pivotX) * this.speed;
    this.pivotY += Math.sign(targetPivotY - this.pivotY) * this.speed;

    if (this.pivotX == targetPivotX && this.pivotY == targetPivotY) {
      this.findNextNode();
    }
  }

  update() {
    if (this.pivotX === basepoint.pivotX && this.pivotY === basepoint.pivotY) {
      this.destroy();
      return;
    }
    this.move();
  }
}

export function spawnEnemy(activeEnemies) {
  activeEnemies.push(
    new Enemy({
      pivotX: spawnpoint.pivotX,
      pivotY: spawnpoint.pivotY,
      hp: 10,
      size: 15,
      speed: 1,
      color: "#d06eb3",
    }),
  );

  console.log(spawnpoint);
}
