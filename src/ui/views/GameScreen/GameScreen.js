import { TowerMenu } from "./menus/TowerMenu.js";

export class GameScreen {
  constructor(uiManager) {
    this.uiContainer = uiManager.container;
    this.game = uiManager.app.game;

    if (!document.getElementById("gamescreen-css")) {
      this.#setStyle();
    }

    this.#setCanvas();
    this.#setStatusPanel();
    this.#setControlMenu();

    this.currentMenu;
  }

  #setStyle() {
    const link = document.createElement("link");
    link.id = "gamescreen-css";
    link.rel = "stylesheet";
    link.href = "./css/views/GameScreen.css";
    document.head.appendChild(link);
  }

  #setCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvasContainer = document.getElementById("canvas-container");

    this.canvas.id = "map-board";
    this.canvas.className = "game-screen__map-board";

    this.canvasContainer.appendChild(this.canvas);
  }

  #setStatusPanel() {
    this.statusContainer = document.createElement("div");
    this.statusContainer.className = "game-screen__control-panel";
    this.statusContainer.id = "control-panel";
    this.statusContainer.innerHTML = `
      <div class="game-status">
        <div class="game-status__left">
          <span>❤️<h3 id="heart">Heart</h3></span>
          <span>🪙<h3 id="gold">Gold</h3></span>
        </div>
        <div class="game-status__right">
          <span><h3>wave</h3></span>
          <span><h3 id="wave">99</h3></span>
        </div>
      </div>
      <div class="control-menu" id="control-menu"></div>
    `;

    this.uiContainer.appendChild(this.statusContainer);
  }

  #setControlMenu() {
    this.menuContainer = document.getElementById("control-menu");

    const menus = {
      TOWER_MENU: new TowerMenu(this),
    };
    this.currentMenu = menus.TOWER_MENU;
  }
}
