export class InputHandler {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;

    this.towers = document.querySelectorAll(".tower");

    this.keys = [];

    this.#mouseInput();
    this.#keyInput();
  }

  #keyInput() {
    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();

      if (key === "w" && !this.keys.includes(key)) {
        console.log(!!game.isPlacementMode);
        console.log(game.isPlacementMode);

        this.keys.push(e.key);
      }
    });

    window.addEventListener("keyup", (e) => {
      const key = e.key.toLowerCase();

      if (key === "w") {
        this.keys = this.keys.filter((k) => k !== key);
      }
    });
  }

  #mouseInput() {
    //====================================
    // Klik pada daftar tower
    //====================================
    this.towers.forEach((tower, index) => {
      tower.addEventListener("click", (e) => {
        e.stopPropagation();

        if (this.game.isPlacementMode) {
          this.#cancelPlacement();
          return;
        }

        this.game.isPlacementMode = tower;

        console.log(`Tower ${index + 1} ter-click`);
      });
    });

    //====================================
    // Klik pada area canvas
    //====================================
    this.canvas.addEventListener("click", (e) => {
      e.stopPropagation();

      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const nodeR = Math.ceil(y / 50);
      const nodeC = Math.ceil(x / 50);

      console.log(`Node click r${nodeR}c${nodeC}`);

      if (this.game.isPlacementMode) {
        console.log("Membangun bangunan");
        this.game.isPlacementMode = null;
      }
    });

    //====================================
    // Klik pada area window
    //====================================
    window.addEventListener("click", (e) => {
      if (this.game.isPlacementMode && e.target !== this.canvas) {
        this.#cancelPlacement();
      }
    });
  }

  #cancelPlacement() {
    console.log("Membatalkan mode pembangunan");
    this.game.isPlacementMode = null;
  }
}
