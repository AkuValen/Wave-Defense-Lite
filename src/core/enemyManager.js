import { Enemy } from "../entities/enemy.js";
import { enemyData } from "./assets.js";

export function spawnEnemy(game) {
  const activeEnemies = game.activeEnemies;

  const randI = Math.floor(Math.random() * enemyData.length);
  const randEnemy = enemyData[randI];

  const spawnpoint = game.mapData.spawnpoint;

  activeEnemies.push(new Enemy(game, randEnemy, spawnpoint));
}
