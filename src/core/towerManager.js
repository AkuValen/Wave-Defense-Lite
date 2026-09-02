import { Tower } from "../entities/tower.js";
import { towerData, bulletImg } from "./assets.js";

function renderBullet(tower, ctx) {
  const bullets = tower.bullets;

  bullets.forEach((bullet) => {
    ctx.save();

    ctx.translate(bullet.pivotX, bullet.pivotY);

    console.log(bullet.pivotX, bullet.pivotY);

    ctx.drawImage(bulletImg, -bullet.size / 2, -bullet.size / 2, bullet.size, bullet.size);
    ctx.restore();
  });
}

function updateBullet(game, tower) {
  const bullets = tower.bullets;

  bullets.forEach((bullet) => {
    bullet.move();

    if (
      bullet.pivotX > game.canvas.width ||
      bullet.pivotX < 0 ||
      bullet.pivotY > game.canvas.height ||
      bullet.pivotY < 0
    ) {
      bullet.isActive = false;
    }
  });

  tower.bullets = bullets.filter((bullet) => bullet.isActive);
}

export function renderTower(game, ctx) {
  const activeTowers = game.activeTowers;

  activeTowers.forEach((tower) => {
    if (tower.bullets.length > 0) renderBullet(tower, ctx);

    ctx.save();
    ctx.translate(tower.pivotX, tower.pivotY);

    ctx.rotate(tower.angle);

    const size = tower.size;

    ctx.drawImage(tower.image, -size / 2, -size / 2, size, size);
    ctx.restore();
  });
}

export function cancelBuild(game) {
  game.isPlacementMode = null;

  console.log(`Membatalkan mode pembangunan`);
}

export function buildTower(game, node) {
  const activeTowers = game.activeTowers;

  const tower = game.isPlacementMode;

  game.player.gold -= tower.cost;
  const newTower = new Tower(game, tower, node);

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

function getDistance(enemy, tower) {
  const diffX = Math.abs(enemy.pivotX - tower.pivotX);
  const diffY = Math.abs(enemy.pivotY - tower.pivotY);

  return Math.sqrt(diffX ** 2 + diffY ** 2);
}

function findNextTarget(game, tower) {
  const activeEnemies = game.activeEnemies;

  const nodeSize = game.mapData.nodeSize;
  const towerMaxRange = tower.range * nodeSize + nodeSize / 2;

  const inRangeEnemy = activeEnemies.filter((enemy) => {
    return getDistance(enemy, tower) <= towerMaxRange;
  });

  if (inRangeEnemy.length <= 0) return;

  const newTarget = inRangeEnemy.reduce((closest, enemy) => {
    return getDistance(enemy, tower) < getDistance(closest, tower) ? enemy : closest;
  });

  tower.target = newTarget;
}

export function updateTower(game) {
  const activeTowers = game.activeTowers;

  activeTowers.forEach((tower) => {
    if (tower.bullets.length > 0) updateBullet(game, tower);

    if (tower.target) {
      tower.aimAt();
      tower.shoot();

      const nodeSize = game.mapData.nodeSize;
      const towerMaxRange = tower.range * nodeSize + nodeSize / 2;

      if (tower.target.hp <= 0 || getDistance(tower.target, tower) > towerMaxRange) {
        tower.target = null;
      }
      return;
    }

    findNextTarget(game, tower);
  });
}
