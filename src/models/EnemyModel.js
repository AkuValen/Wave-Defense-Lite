export class EnemyModel {
  constructor(data, spawnpoint) {
    this.health = data.attributes.max_health;
    this.speed = data.attributes.move_speed;

    this.size = data.assets.scale;
    this.color = data.assets.color;

    this.pivotX = spawnpoint.pivotX;
    this.pivotY = spawnpoint.pivotY;

    this.currentNode = spawnpoint;
    this.nextNode;

    this.isActive = true;
  }

  setNextNode(map) {
    const neighborNode = [
      { r: this.currentNode.row - 1, c: this.currentNode.column },
      { r: this.currentNode.row, c: this.currentNode.column + 1 },
      { r: this.currentNode.row + 1, c: this.currentNode.column },
      { r: this.currentNode.row, c: this.currentNode.column - 1 },
    ];

    let nNode = [];

    const mapGrid = map.mapGrid;
    const row = map.mapData.row;
    const column = map.mapData.column;

    for (let n of neighborNode) {
      if (n.r < 1 || n.r > row || n.c < 1 || n.c > column) {
        continue;
      }
      if (mapGrid[n.r - 1][n.c - 1].isOccupied) {
        continue;
      }

      nNode.push(mapGrid[n.r - 1][n.c - 1]);
    }

    const closest = Math.min(...nNode.map((node) => node.distance));

    nNode = nNode.filter((node) => node.distance === closest);

    this.nextNode = nNode[Math.floor(Math.random() * nNode.length)];
  }

  move() {
    const deltaX = Math.abs(this.nextNode.pivotX - this.pivotX);
    const deltaY = Math.abs(this.nextNode.pivotY - this.pivotY);

    if (deltaX < this.speed) {
      this.pivotX = this.nextNode.pivotX;
    } else {
      this.pivotX += Math.sign(this.nextNode.pivotX - this.pivotX) * this.speed;
    }
    if (deltaY < this.speed) {
      this.pivotY = this.nextNode.pivotY;
    } else {
      this.pivotY += Math.sign(this.nextNode.pivotY - this.pivotY) * this.speed;
    }

    if (this.pivotX == this.nextNode.pivotX && this.pivotY == this.nextNode.pivotY) {
      this.currentNode = this.nextNode;
      this.nextNode = null;
    }
  }

  takeDamage(bullet) {
    this.health -= bullet.atk;

    if (this.health <= 0) this.isActive = false;
  }

  destroy() {
    this.isActive = false;
  }
}
