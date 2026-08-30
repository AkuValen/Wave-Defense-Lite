import { Tower } from "../entities/tower.js";
import { towerData } from "./assets.js";

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
