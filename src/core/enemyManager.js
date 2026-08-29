import { Enemy } from "../entities/enemy.js";
import { enemyData } from "../core/assets.js";

export function spawnEnemy(game) {
  const activeEnemies = game.activeEnemies;

  const randI = Math.floor(Math.random() * enemyData.length);
  const randEnemy = enemyData[randI];

  const spawnpoint = game.mapData.spawnpoint;

  console.log(spawnpoint);

  activeEnemies.push(
    new Enemy(game, {
      pivotX: spawnpoint.pivotX,
      pivotY: spawnpoint.pivotY,
      hp: randEnemy.hp,
      size: randEnemy.size,
      speed: randEnemy.speed,
      color: "#d06eb3",
    }),
  );
}
