export class TowerModel {
  constructor(data, node, image) {
    this.name = data.display_name;

    // Atribut
    this.atk = data.attributes.atk;
    this.range = data.attributes.range;
    this.bullet = data.attributes.bullet;
    this.maxBullet = data.attributes.bullet;
    this.cooldown = data.attributes.cooldown;
    this.bulletType = data.attributes.bullet_type;

    // Posisi
    this.pivotX = node.pivotX;
    this.pivotY = node.pivotY;

    // Asset
    this.image = image;
    this.angle = 0;
    this.size = 40;

    // Status
    this.target = null;
    this.reloadCountDown = 0;
  }

  #getDistance(a, b) {
    const diffX = Math.abs(a.pivotX - b.pivotX);
    const diffY = Math.abs(a.pivotY - b.pivotY);

    return Math.sqrt(diffX ** 2 + diffY ** 2);
  }

  setNextTarget(game) {
    const activeEnemies = game.enemySystem.activeEnemies;
    if (activeEnemies.length <= 0) return;

    const nodeSize = game.map.nodeSize;
    const towerMaxRange = this.range * nodeSize + nodeSize / 2;

    const closestTarget = activeEnemies.reduce((closest, enemy) => {
      return this.#getDistance(enemy, this) < this.#getDistance(closest, this) ? enemy : closest;
    });

    this.target = this.#getDistance(closestTarget, this) <= towerMaxRange ? closestTarget : null;
  }

  aimTarget() {
    const deltaX = this.target.pivotX - this.pivotX;
    const deltaY = this.target.pivotY - this.pivotY;

    this.angle = Math.atan2(deltaY, deltaX) + Math.PI / 2;
  }

  checkTarget(game) {
    const nodeSize = game.map.nodeSize;
    const towerMaxRange = this.range * nodeSize + nodeSize / 2;

    if (!this.target.isActive || this.#getDistance(this.target, this) > towerMaxRange) {
      this.target = null;
    }
  }

  shoot() {
    this.bullet--;
    if (this.bullet <= 0) {
      this.reloadCountDown = this.cooldown;
    }
  }

  reload() {
    this.reloadCountDown--;
    if (this.reloadCountDown <= 0) {
      this.bullet = this.maxBullet;
    }
  }
}
