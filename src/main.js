import { configGameData } from "./core/assets.js";
import { InputHandler } from "./core/input.js";

import { newMap, renderMap, updateMapScore } from "./map/map.js";
import { updateEnemy, renderEnemy, spawnEnemy } from "./core/enemyManager.js";
import {
  buildTower,
  selectTower,
  cancelBuild,
  updateTower,
  renderTower,
} from "./core/towerManager.js";

class Game {
  constructor() {
    this.canvas = document.getElementById("game-canvas");

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

    this.time = {
      tick: false,
      second: 0,
      lasttime: 0,
      accumulator: 0,
    };
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

  timeCounter(timestamp) {
    if (this.lasttime <= 0) this.time.lasttime = timestamp;
    let deltaT = timestamp - this.time.lasttime;

    this.time.accumulator += deltaT;

    if (this.time.accumulator >= 1000) {
      this.time.accumulator -= 1000;

      this.time.second++;
      this.time.tick = true;
      console.log(this.time.second);
    } else {
      this.time.tick = false;
    }

    this.time.lasttime = timestamp;
  }

  render() {
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    renderMap(this, ctx);

    renderEnemy(this, ctx);
    renderTower(this, ctx);
  }

  update() {
    updateEnemy(this);
    updateTower(this);
  }

  loop(timestamp) {
    this.timeCounter(timestamp);

    if (this.frameCounter % 180 == 0) {
      spawnEnemy(this);
    }

    this.update();
    this.render();

    requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  start() {
    const ctx = this.canvas.getContext("2d");
    newMap(this, ctx);

    setTimeout(() => {
      spawnEnemy(this);
    }, 5000);

    requestAnimationFrame((timestamp) => this.loop(timestamp));
  }
}

window.addEventListener("load", () => {
  new Game();
});
