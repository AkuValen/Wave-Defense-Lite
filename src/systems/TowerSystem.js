import { TowerModel } from "../models/TowerModel.js";
import { AssetsLoader } from "../utils/AssetsLoader.js";
import { BulletSystem } from "./BulletSystem.js";

export class TowerSystem {
  constructor(game) {
    this.game = game;

    this.isSelectTower = null;

    this.bulletSystem = new BulletSystem(this.game);

    this.activeTowers = [];
  }

  select(tower) {
    console.log("Memilih tower: ", tower);

    this.isSelectTower = AssetsLoader.getTowerData(tower);
  }

  build(node) {
    console.log("Membangun tower: ", this.isSelectTower);

    const image = AssetsLoader.getTowerImage(this.isSelectTower.assets.image);

    this.activeTowers.push(new TowerModel(this.isSelectTower, node, image));
    this.isSelectTower = null;
  }

  updateTower() {
    this.activeTowers.forEach((tower) => {
      if (tower.activeBullets.length > 0) {
        this.bulletSystem.updateBullet(tower);
      }

      if (this.game.time.tick && tower.cooldown > 0) {
        tower.reload();
      }

      if (!tower.target) {
        tower.setNextTarget(this.game);
        return;
      }

      tower.aimAt();

      if (tower.cooldown <= 0) {
        tower.shoot(this.bulletSystem.createBullet(tower));
      }

      tower.checkTarget(this.game);
    });
  }

  renderTower(ctx) {
    this.activeTowers.forEach((tower) => {
      if (tower.activeBullets.length > 0) {
        this.bulletSystem.renderBullet(tower, ctx);
      }

      ctx.save();
      ctx.translate(tower.pivotX, tower.pivotY);

      ctx.rotate(tower.angle);

      const size = tower.size;

      ctx.drawImage(tower.image, -size / 2, -size / 2, size, size);
      ctx.restore();
    });
  }
}

export function cancelBuild(game) {
  game.isPlacementMode = null;

  console.log(`Membatalkan mode pembangunan`);
}

export function buildTower(game, node) {
  const activeTowers = game.activeTowers;

  const tower = game.isPlacementMode;

  game.player.gold -= tower.cost;
  // const newTower = ;

  game.isPlacementMode = null;

  node.isOccupied = newTower;

  activeTowers.push(newTower);

  console.log(`${newTower.name} telah dibangun`);
}

export function selectTower(game, index) {
  const selectedTower = towerData[index];

  if (game.player.gold >= selectedTower.cost) {
    console.log("Gold cukup, masuk ke mode pembangunan");

    game.isPlacementMode = selectedTower;
  } else {
    console.log("Gold tidak cukup");
  }
}

function findNextTarget(game, tower) {}

export function updateTower(game) {}
