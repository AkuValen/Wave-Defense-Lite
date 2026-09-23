import { Map } from "./world/Map.js";
import { EnemySystem } from "./systems/EnemySystem.js";
import { TowerSystem } from "./systems/TowerSystem.js";

export class Game {
  constructor(app) {
    this.app = app;

    this.canvas = this.app.uiManager.views.GAME_SCREEN.canvas;
    this.ctx = this.canvas.getContext("2d");

    this.time = {
      tick: false,
      second: 0,
    };
    this.timeAccumulator = {
      accumulator: 0,
      lastTime: 0,
    };

    this.map = new Map(this);

    this.playerSystem;
    this.enemySystem = new EnemySystem(this);
    this.towerSystem = new TowerSystem(this);

    this.loopId;
    this.#start();
  }

  #timeCounter(timestamp) {
    if (this.timeAccumulator.lastTime <= 0) this.timeAccumulator.lastTime = timestamp;
    const deltaT = timestamp - this.timeAccumulator.lastTime;

    this.timeAccumulator.accumulator += deltaT;

    if (this.timeAccumulator.accumulator >= 1000) {
      this.timeAccumulator.accumulator -= 1000;
      this.time.second++;
      this.time.tick = true;
      console.log("Second: ", this.time.second);
      console.log(
        `Total Enemy ${this.enemySystem.activeEnemies.length}, Tower ${this.towerSystem.activeTowers.length}`,
      );
    } else {
      this.time.tick = false;
    }

    this.timeAccumulator.lastTime = timestamp;
  }

  #start() {
    this.map.newMap();
    this.enemySystem.setRate();

    const loop = (timestamp) => {
      this.#timeCounter(timestamp);

      this.#update();
      this.#render();

      if (this.time.tick) this.enemySystem.spawn();

      if (!this.app.isFocus) {
        cancelAnimationFrame(this.loopId);
      } else {
        this.loopId = requestAnimationFrame(loop);
      }
    };
    this.loopId = requestAnimationFrame(loop);
  }

  #update() {
    this.enemySystem.updateEnemy();
    this.towerSystem.updateTower();
  }

  #render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.map.renderMap(this.canvas, this.ctx);
    this.enemySystem.renderEnemy(this.ctx);
    this.towerSystem.renderTower(this.ctx);
  }
}
