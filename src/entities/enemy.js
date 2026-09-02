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
  }

  move() {
    // const targetPivotX = this.nextNode.column * nodeSize - nodeSize / 2;
    // const targetPivotY = this.nextNode.row * nodeSize - nodeSize / 2;

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
      this.nextNode = null;
    }
  }

  setNextNode(nextNode) {
    this.nextNode = nextNode;
  }
}
