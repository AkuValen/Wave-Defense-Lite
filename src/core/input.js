export class InputHandler {
  constructor(game, clickEvent) {
    this.game = game;
    this.canvas = game.canvas;

    this.towers = document.querySelectorAll(".tower");

    this.keys = [];

    this.clickEvent = clickEvent;

    this.isFocus = true;

    this.#mouseInput();
    this.#keyInput();
    this.#documentInput();
    this.#windowInput();
  }

  #keyInput() {
    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
    });

    window.addEventListener("keyup", (e) => {
      const key = e.key.toLowerCase();
    });
  }

  #mouseInput() {
    //====================================
    // Klik pada daftar tower
    //====================================
    this.towers.forEach((tower, index) => {
      tower.addEventListener("click", (e) => {
        e.stopPropagation();

        if (this.clickEvent) {
          this.clickEvent({ isSelectTower: true, index });
        }
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

      if (this.clickEvent) {
        this.clickEvent({ isSelectNode: true, x, y });
      }
    });

    //====================================
    // Klik pada area window
    //====================================
    window.addEventListener("click", () => {
      if (this.clickEvent) {
        this.clickEvent({ isSelectNone: true });
      }
    });
  }

  #documentInput() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        console.log("Pindah tab");

        this.isFocus = false;
      } else {
        console.log("Kembali tab");

        this.isFocus = true;
        this.game.resume();
      }
    });
  }

  #windowInput() {
    window.addEventListener("blur", () => {
      console.log("Blur");

      this.isFocus = false;
    });

    window.addEventListener("focus", () => {
      console.log("Focus");

      this.isFocus = true;
      this.game.resume();
    });
  }
}
