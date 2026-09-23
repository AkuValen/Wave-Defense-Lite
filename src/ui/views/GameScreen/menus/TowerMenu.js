import { AssetsLoader } from "../../../../utils/AssetsLoader.js";

export class TowerMenu {
  constructor(gameScreen) {
    this.menuContainer = gameScreen.menuContainer;
    this.game = gameScreen.game;

    this.towers = AssetsLoader.getTowerData();

    this.towerMenu;
    this.#setTowerMenu();
  }

  #setTowerMenu() {
    this.towerMenu = document.createElement("ul");
    this.towerMenu.className = "tower-menu";

    for (const tower in this.towers) {
      this.towerMenu.innerHTML += `
      <li class="tower">
        <div class="tower-card" id="${tower}">
          <h1>${this.towers[tower].display_name}</h1>
        </div>
      </li>`;
    }

    this.menuContainer.appendChild(this.towerMenu);
  }
}
