export class PlayerSystem {
  constructor() {
    this.player = {
      heart: 3,
      gold: 10,
    };

    this.#setStatus();
  }

  #setStatus() {
    this.heartStatus = document.getElementById("game-status__heart");
    this.goldStatus = document.getElementById("game-status__gold");

    this.heartStatus.textContent = this.player.heart;
    this.goldStatus.textContent = this.player.gold;
  }

  attackBase() {
    this.player.heart--;
    this.heartStatus.textContent = this.player.heart;
  }

  useGold(cost) {
    this.player.gold -= cost;
    this.goldStatus.textContent = this.player.gold;
  }
}
