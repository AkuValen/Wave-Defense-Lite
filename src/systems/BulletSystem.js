import { BulletModel } from "../models/BulletModel.js";
import { AssetsLoader } from "../utils/AssetsLoader.js";
import { Bullet, Wave, Plasma } from "../models/TowerBulletModel.js";

export class BulletSystem {
  constructor(game) {
    this.game = game;

    this.image = AssetsLoader.getBulletImage();

    this.activeBullets = [];
  }

  createBullet(tower) {
    let newBullet;
    if (tower.bulletType == "bullet") {
      newBullet = new Bullet(tower, this.image);
    } else if (tower.bulletType == "wave") {
      newBullet = new Wave(tower, this.image);
    } else if (tower.bulletType == "plasma") {
      newBullet = new Plasma(tower, this.image);
    }
    this.activeBullets.push(newBullet);
  }

  updateBullet() {
    if (this.activeBullets.length <= 0) return;

    this.activeBullets.forEach((bullet) => {
      bullet.update(this.game);

      if (this.game.enemySystem.activeEnemies.length <= 0) return;

      bullet.checkCollision(this.game);

      if (bullet.isCollision.length > 0) {
        bullet.isCollision.forEach((enemy) => {
          enemy.takeDamage(bullet);
        });
      }
    });

    this.activeBullets = this.activeBullets.filter((bullet) => bullet.isActive);
  }

  renderBullet(ctx) {
    this.activeBullets.forEach((bullet) => {
      ctx.save();
      ctx.translate(bullet.pivotX, bullet.pivotY);

      ctx.drawImage(bullet.image, -bullet.size / 2, -bullet.size / 2, bullet.size, bullet.size);
      ctx.restore();
    });
  }
}
