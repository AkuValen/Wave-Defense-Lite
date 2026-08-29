const towers = document.querySelectorAll(".control-area div");
console.log(towers);

export class InputHandler {
  constructor(canvas) {
    this.keys = [];

    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();

      if (key === "w" && !this.keys.includes(key)) {
        this.keys.push(e.key);
      }
    });

    window.addEventListener("keyup", (e) => {
      const key = e.key.toLowerCase();

      if (key === "w") {
        this.keys = this.keys.filter((k) => k !== key);
      }
    });

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const nodeR = Math.ceil(y / 50);
      const nodeC = Math.ceil(x / 50);

      console.log(`Node click r${nodeR}c${nodeC}`);
    });
  }
}
