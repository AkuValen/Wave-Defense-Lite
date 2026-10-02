import { TowerModel } from "../models/TowerModel.js";
import { AssetsLoader } from "../utils/AssetsLoader.js";

export class TowerSystem {
  constructor(game) {
    this.game = game;

    this.isSelectTower = null;
    this.activeTowers = [];
  }

  select(tower) {
    const selectedTower = AssetsLoader.getTowerData(tower);

    console.log(selectedTower);
    if (this.game.playerSystem.player.gold < selectedTower.attributes.cost) {
      console.log("Tidak punya cukup gold");
      return;
    }

    this.isSelectTower = selectedTower;
  }

  build(node) {
    this.game.playerSystem.useGold(this.isSelectTower.attributes.cost);
    node.isOccupied = true;

    const image = AssetsLoader.getTowerImage(this.isSelectTower.assets.image);

    this.activeTowers.push(new TowerModel(this.isSelectTower, node, image));
    this.isSelectTower = null;
  }

  invalidBuild() {
    console.log("Invalid membangun tower");
    this.isSelectTower = null;
  }

  updateTower() {
    this.activeTowers.forEach((tower) => {
      if (this.game.time.tick && tower.bullet <= 0) {
        tower.reload();
      }

      if (!tower.target) {
        tower.setNextTarget(this.game);
      }

      if (tower.target) {
        tower.aimTarget();

        if (tower.bullet > 0) {
          tower.shoot();
          this.game.bulletSystem.createBullet(tower);
        }

        tower.checkTarget(this.game);
      }
    });
  }

  renderTower(ctx) {
    this.activeTowers.forEach((tower) => {
      ctx.save();
      ctx.translate(tower.pivotX, tower.pivotY);

      ctx.rotate(tower.angle);

      ctx.drawImage(tower.image, -tower.size / 2, -tower.size / 2, tower.size, tower.size);
      ctx.restore();
    });
  }
}
