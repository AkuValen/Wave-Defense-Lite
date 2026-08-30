export class Enemy {
  constructor(game, enemyData, spawnpoint) {
    this.game = game;

    this.hp = enemyData.hp;
    this.speed = enemyData.speed;

    this.size = enemyData.size;
    this.color = enemyData.color;

    this.pivotX = spawnpoint.pivotX;
    this.pivotY = spawnpoint.pivotY;

    this.nextNode;

    this.findNextNode();
  }

  destroy() {
    this.hp = 0;
  }

  findNextNode() {
    const mapGrid = this.game.mapGrid;

    const currentR = Math.ceil(this.pivotY / this.game.mapData.nodeSize);
    const currentC = Math.ceil(this.pivotX / this.game.mapData.nodeSize);
    const currentNode = mapGrid[currentR - 1][currentC - 1];

    const neighborNode = [
      { r: currentNode.row - 1, c: currentNode.column },
      { r: currentNode.row, c: currentNode.column + 1 },
      { r: currentNode.row + 1, c: currentNode.column },
      { r: currentNode.row, c: currentNode.column - 1 },
    ];

    let nNode = [];

    const row = this.game.mapData.row;
    const column = this.game.mapData.column;

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

    this.nextNode = nNode[Math.floor(Math.random() * nNode.length)];
  }

  move() {
    if (!this.nextNode) {
      this.findNextNode();
    }

    const nodeSize = this.game.mapData.nodeSize;

    const targetPivotX = this.nextNode.column * nodeSize - nodeSize / 2;
    const targetPivotY = this.nextNode.row * nodeSize - nodeSize / 2;

    const xPixToNext = Math.abs(targetPivotX - this.pivotX);
    const yPixToNext = Math.abs(targetPivotY - this.pivotY);

    if (xPixToNext < this.speed) {
      this.pivotX = targetPivotX;
    } else {
      this.pivotX += Math.sign(targetPivotX - this.pivotX) * this.speed;
    }
    if (yPixToNext < this.speed) {
      this.pivotY = targetPivotY;
    } else {
      this.pivotY += Math.sign(targetPivotY - this.pivotY) * this.speed;
    }

    if (this.pivotX == targetPivotX && this.pivotY == targetPivotY) {
      this.findNextNode();
    }
  }

  update() {
    const basepoint = this.game.mapData.basepoint;

    if (this.pivotX === basepoint.pivotX && this.pivotY === basepoint.pivotY) {
      this.destroy();
      return;
    }
    this.move();
  }
}
