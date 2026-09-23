// import { Bullet } from "../../X entities/bullet.js";

export class Tower {
  constructor(data, node) {
    this.name = data.display_name;

    this.atk = data.attributes.atk;
    this.firerate = data.attributes.firerate;
    this.range = data.attributes.range;

    this.pivotX = node.pivotX;
    this.pivotY = node.pivotY;

    this.image = data.assets.image;
    this.angle = 0;
    this.size = 40;

    this.target = null;

    this.bullets = [];
    this.cooldown = 0;
  }

  #getDistance(a, b) {
    const diffX = Math.abs(a.pivotX - b.pivotX);
    const diffY = Math.abs(a.pivotY - b.pivotY);

    return Math.sqrt(diffX ** 2 + diffY ** 2);
  }

  setNextTarget(game) {
    const activeEnemies = game.activeEnemies;
    if (activeEnemies.length <= 0) return;

    const nodeSize = game.map.nodeSize;
    const towerMaxRange = this.range * nodeSize + nodeSize / 2;

    const closestTarget = activeEnemies.reduce((closest, enemy) => {
      return this.#getDistance(enemy, this) < this.#getDistance(closest, this) ? enemy : closest;
    });

    this.target = this.#getDistance(closestTarget, this) <= towerMaxRange ? closestTarget : null;
  }

  checkTarget(game) {
    const nodeSize = game.map.nodeSize;
    const towerMaxRange = this.range * nodeSize + nodeSize / 2;

    if (this.target.health <= 0 || this.#getDistance(this.target, this > towerMaxRange)) {
      this.target = null;
    }
  }

  shoot() {
    if (this.cooldown) {
      this.cooldown--;
      return;
    }

    this.bullets.push(
      new Bullet({
        atk: this.atk,
        pivotX: this.pivotX,
        pivotY: this.pivotY,
        angle: this.angle,
      }),
    );

    this.cooldown += this.firerate;
  }

  aimAt() {
    const deltaX = this.target.pivotX - this.pivotX;
    const deltaY = this.target.pivotY - this.pivotY;

    this.angle = Math.atan2(deltaY, deltaX) + Math.PI / 2;
  }
}
