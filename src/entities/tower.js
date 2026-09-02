import { Bullet } from "./bullet.js";

export class Tower {
  constructor(game, towerData, node) {
    // this.game = game;

    this.name = towerData.name;
    this.atk = towerData.atk;
    this.firerate = towerData.firerate;
    this.range = towerData.range;

    this.pivotX = node.pivotX;
    this.pivotY = node.pivotY;

    this.image = towerData.image;
    this.angle = 0;
    this.size = 40;

    this.target = null;

    this.bullets = [];
    this.isShoot = false;
  }

  shoot() {
    if (this.isShoot) return;
    this.isShoot = true;

    const bullet = this.bullets.push(
      new Bullet({
        atk: this.atk,
        pivotX: this.pivotX,
        pivotY: this.pivotY,
        angle: this.angle,
      }),
    );

    console.log(this.pivotX, this.pivotY);
    console.log(bullet);
  }

  aimAt() {
    const deltaX = this.target.pivotX - this.pivotX;
    const deltaY = this.target.pivotY - this.pivotY;

    this.angle = Math.atan2(deltaY, deltaX) + Math.PI / 2;
  }
}
