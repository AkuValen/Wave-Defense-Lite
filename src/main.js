import { configGameData } from "./core/assets.js";
import { InputHandler } from "./core/input.js";

import { newMap, drawMap } from "./map/map.js";
import { spawnEnemy } from "./core/enemyManager.js";

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

    this.frameCounter = 0;

    this.start();
  }

  click(clickEvent) {
    console.log("Event: ", clickEvent);

    if (clickEvent.isSelectTower) {
      const indexTower = clickEvent.index;

      console.log(`Tower ${indexTower + 1} ter-click`);
    }

    if (clickEvent.isSelectNode) {
      const node = {
        row: clickEvent.nodeR,
        column: clickEvent.nodeC,
      };

      console.log(`Node click r${node.row}c${node.column}`);
    }

    if (clickEvent.isSelectNone) {
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
    if (this.activeEnemies.length <= 0) {
      return;
    }

    for (let enemy of this.activeEnemies) {
      enemy.update();
    }

    for (let tower of this.activeTowers) {
      tower.shoot();
    }

    this.activeEnemies = this.activeEnemies.filter((enemy) => enemy.hp > 0);
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    drawMap(this);

    if (this.activeEnemies.length <= 0) {
      return;
    }

    for (let enemy of this.activeEnemies) {
      this.ctx.fillStyle = enemy.color;

      this.ctx.beginPath();
      this.ctx.arc(enemy.pivotX, enemy.pivotY, enemy.size, 0, Math.PI * 2);

      this.ctx.fill();
    }
  }
}

window.addEventListener("load", () => {
  new Game();
});
