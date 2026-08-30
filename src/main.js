import { configGameData } from "./core/assets.js";
import { InputHandler } from "./core/input.js";

import { newMap, drawMap, updateMapScore } from "./map/map.js";
import { spawnEnemy } from "./core/enemyManager.js";
import { buildTower, selectTower, cancelBuild } from "./core/towerManager.js";

class Game {
  constructor() {
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");

    this.input = new InputHandler(this, (clickEvent) => this.click(clickEvent));

    this.config = configGameData();

    this.mapData = {
      row: 10,
      column: 10,
      nodeSize: 50,
    };
    this.mapGrid = [];

    this.activeEnemies = [];
    this.activeTowers = [];

    this.isPlacementMode = null;

    this.player = {
      heart: 0,
      gold: 10,
    };

    this.frameCounter = 0;
    this.waveCounter = 0;

    this.start();
  }

  click(clickEvent) {
    if (clickEvent.isSelectTower) {
      const index = clickEvent.index;

      console.log(`Tower ${index + 1} ter-click`);

      selectTower(this, index);
    }

    if (clickEvent.isSelectNode) {
      const row = Math.ceil(clickEvent.y / this.mapData.nodeSize);
      const column = Math.ceil(clickEvent.x / this.mapData.nodeSize);

      const node = this.mapGrid[row - 1][column - 1];

      console.log(`Node click r${node.row}c${node.column}`);
      console.log(node);

      if (this.isPlacementMode) {
        buildTower(this, node);
        updateMapScore(this);

        const printScore = this.mapGrid.map((row) => row.map((node) => node.gScore));
        console.table(printScore);
      }
    }

    if (clickEvent.isSelectNone) {
      if (this.isPlacementMode) {
        cancelBuild(this);
      }
    }
  }

  start() {
    newMap(this);

    setTimeout(() => {
      spawnEnemy(this);
    }, 5000);

    requestAnimationFrame(() => this.loop());
  }

  loop() {
    this.frameCounter++;

    if (this.frameCounter % 180 == 0) {
      spawnEnemy(this);
    }

    this.update();
    this.render();

    requestAnimationFrame(() => this.loop());
  }

  update() {
    for (let enemy of this.activeEnemies) {
      enemy.update();
    }

    for (let tower of this.activeTowers) {
      tower.update();
    }

    this.activeEnemies = this.activeEnemies.filter((enemy) => enemy.hp > 0);
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    drawMap(this);

    for (let enemy of this.activeEnemies) {
      this.ctx.fillStyle = enemy.color;

      this.ctx.beginPath();
      this.ctx.arc(enemy.pivotX, enemy.pivotY, enemy.size, 0, Math.PI * 2);

      this.ctx.fill();
    }

    for (let tower of this.activeTowers) {
      this.ctx.save();

      this.ctx.translate(tower.pivotX, tower.pivotY);

      if (tower.target) {
        const diffX = tower.target.pivotX - tower.pivotX;
        const diffY = tower.target.pivotY - tower.pivotY;

        tower.angle = Math.atan2(diffY, diffX) + Math.PI / 2;
      }

      this.ctx.rotate(tower.angle);

      const towerSize = 40;

      this.ctx.drawImage(tower.image, -towerSize / 2, -towerSize / 2, towerSize, towerSize);

      this.ctx.restore();
    }
  }
}

window.addEventListener("load", () => {
  new Game();
});
