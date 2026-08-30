export class Tower {
  constructor(game, towerData, node) {
    this.game = game;

    this.name = towerData.name;
    this.atk = towerData.atk;
    this.firerate = towerData.firerate;
    this.range = towerData.range;
    this.image = towerData.image;

    this.pivotX = node.pivotX;
    this.pivotY = node.pivotY;
    this.angle = 0;

    this.target = null;

    this.findNextTarget();
  }

  getDistance(enemy) {
    const diffX = Math.abs(enemy.pivotX - this.pivotX);
    const diffY = Math.abs(enemy.pivotY - this.pivotY);

    return Math.sqrt(diffX ** 2 + diffY ** 2);
  }

  findNextTarget() {
    const activeEnemies = this.game.activeEnemies;

    const nodeSize = this.game.mapData.nodeSize;
    const maxRange = this.range * nodeSize + nodeSize / 2;

    const inRangeEnemy = activeEnemies.filter((enemy) => this.getDistance(enemy) < maxRange);

    if (inRangeEnemy.length <= 0) return;

    this.target = inRangeEnemy.reduce((closest, enemy) => {
      return this.getDistance(enemy) < this.getDistance(closest) ? enemy : closest;
    });
  }

  shoot() {
    if (!this.target) {
      this.findNextTarget();
      return;
    }

    const nodeSize = this.game.mapData.nodeSize;
    const maxRange = this.range * nodeSize + nodeSize / 2;

    if (this.target.hp <= 0 || this.getDistance(this.target) > maxRange) {
      this.target = null;
    }
  }

  update() {
    this.shoot();
    // console.log(this.target);
  }
}
