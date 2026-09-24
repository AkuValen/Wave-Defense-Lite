import { EnemyModel } from "../models/EnemyModel.js";
import { AssetsLoader } from "../utils/AssetsLoader.js";

export class EnemySystem {
  constructor(game) {
    this.game = game;

    this.variant = {
      weakling: 1,
      roamer: 0,
      swift: 0,
      tank: 0,
    };
    this.spawnRate = {};

    this.activeEnemies = [];
  }

  setRate() {
    let totalVariant = 0;

    Object.values(this.variant).forEach((value) => (totalVariant += value));

    for (const v in this.variant) {
      if (this.variant[v] <= 0) continue;

      this.spawnRate[v] = this.variant[v] / totalVariant;
    }
  }

  spawn() {
    let newEnemyData;

    let rateAccumulator = Math.random();
    for (const r in this.spawnRate) {
      if (rateAccumulator < this.spawnRate[r]) {
        newEnemyData = AssetsLoader.getEnemyData(r);
        break;
      }
    }

    const spawnpoint = this.game.map.mapData.spawnpoint;
    this.activeEnemies.push(new EnemyModel(newEnemyData, spawnpoint));
  }

  updateEnemy() {
    if (this.activeEnemies <= 0) return;

    this.activeEnemies.forEach((enemy) => {
      if (!enemy.nextNode) {
        enemy.setNextNode(this.game.map);
      }

      enemy.move();

      if (enemy.currentNode.isBasepoint) {
        this.game.playerSystem.attackBase();
        // enemy.attackBase(this.game.playerSystem.player);
        enemy.destroy();
      }
    });

    this.activeEnemies = this.activeEnemies.filter((enemy) => enemy.isActive);
  }

  renderEnemy(ctx) {
    this.activeEnemies.forEach((enemy) => {
      ctx.fillStyle = enemy.color;

      ctx.beginPath();
      ctx.arc(enemy.pivotX, enemy.pivotY, enemy.size, 0, Math.PI * 2);

      ctx.fill();
    });
  }
}
