import { map, mapGrid, spawnpoint, basepoint } from "../map/map.js";

export let enemies = [];

export function updateEnemies() {
  enemies = enemies.filter((enemy) => enemy.hp > 0);
}

export function spawnEnemy() {
  enemies.push({
    pivotX: spawnpoint.pivotX,
    pivotY: spawnpoint.pivotY,
    hp: 10,
    size: 15,
    speed: 1,
    color: "#d06eb3",
  });

  console.log(enemies);
}
