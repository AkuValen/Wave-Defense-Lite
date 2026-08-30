export class InputHandler {
  constructor(game, clickEvent) {
    this.canvas = game.canvas;

    this.towers = document.querySelectorAll(".tower");

    this.keys = [];

    this.clickEvent = clickEvent;

    this.#mouseInput();
    this.#keyInput();
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

      const nodeR = Math.ceil(y / 50);
      const nodeC = Math.ceil(x / 50);

      if (this.clickEvent) {
        this.clickEvent({ isSelectNode: true, nodeR, nodeC });
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
}
