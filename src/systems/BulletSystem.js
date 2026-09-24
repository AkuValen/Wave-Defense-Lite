import { BulletModel } from "../models/BulletModel.js";
import { AssetsLoader } from "../utils/AssetsLoader.js";

export class BulletSystem {
  constructor(game) {
    this.game = game;
    this.image = AssetsLoader.getBulletImage();
  }

  createBullet(tower) {
    return new BulletModel(tower, this.image);
  }

  #getDistance(a, b) {
    const diffX = Math.abs(a.pivotX - b.pivotX);
    const diffY = Math.abs(a.pivotY - b.pivotY);

    return Math.sqrt(diffX ** 2 + diffY ** 2);
  }

  updateBullet(tower) {
    tower.activeBullets.forEach((bullet) => {
      bullet.move(this.game);

      if (this.game.enemySystem.activeEnemies.length <= 0) return;

      const closestEnemy = this.game.enemySystem.activeEnemies.reduce((closest, enemy) => {
        return this.#getDistance(enemy, bullet) < this.#getDistance(closest, bullet)
          ? enemy
          : closest;
      });

      const isCollision =
        this.#getDistance(closestEnemy, bullet) <= closestEnemy.size + bullet.size / 2;

      if (isCollision) {
        closestEnemy.takeDamage(bullet);
        bullet.destroy();
      }
    });

    tower.activeBullets = tower.activeBullets.filter((bullet) => bullet.isActive);
  }

  renderBullet(tower, ctx) {
    tower.activeBullets.forEach((bullet) => {
      ctx.save();
      ctx.translate(bullet.pivotX, bullet.pivotY);

      ctx.drawImage(bullet.image, -bullet.size / 2, -bullet.size / 2, bullet.size, bullet.size);
      ctx.restore();
    });
  }
}
