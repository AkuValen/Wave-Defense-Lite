import { GameScreen } from "./views/GameScreen/GameScreen.js";

export class UIManager {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById("ui-container");

    this.views = {
      GAME_SCREEN: new GameScreen(this),
    };

    this.currentView = this.views.GAME_SCREEN;
  }
}
