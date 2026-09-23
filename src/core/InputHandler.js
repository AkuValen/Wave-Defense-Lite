export class InputHandler {
  constructor(app) {
    this.app = app;

    this.isClick = null;

    this.#towerMenuInput();
    this.#canvasInput();
  }

  #towerMenuInput() {
    const towerCards = document.querySelectorAll(".tower-card");

    towerCards.forEach((towerCard) => {
      towerCard.addEventListener("click", (event) => {
        event.stopPropagation();
        this.app.game.towerSystem.select(event.currentTarget.id);
      });
    });
  }

  #canvasInput() {
    const mapBoard = document.getElementById("map-board");

    mapBoard.addEventListener("click", (event) => {
      event.stopPropagation();

      const rect = mapBoard.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.isClick = {
        x,
        y,
      };

      this.app.game.map.mapClick(this);
    });
  }
}
