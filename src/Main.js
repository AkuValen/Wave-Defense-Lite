import { AssetsLoader } from "./utils/AssetsLoader.js";
import { UIManager } from "./ui/UIManager.js";
import { Game } from "./Game.js";
import { InputHandler } from "./core/InputHandler.js";

class App {
  constructor() {
    this.isFocus = true;

    this.uiManager = new UIManager(this);
    this.game = new Game(this);

    this.input = new InputHandler(this);
  }
}

window.addEventListener("load", async () => {
  try {
    console.log("Masuk ke assetloader");
    await AssetsLoader.loadAsset();

    console.log("Images: ", AssetsLoader.images);
    console.log("Data: ", AssetsLoader.data);

    new App();
  } catch (error) {
    console.error("Terjadi kerusakan: ", error);
  }
});
