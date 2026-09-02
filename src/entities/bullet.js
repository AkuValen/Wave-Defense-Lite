export class Bullet {
  constructor(data) {
    this.damage = data.atk;

    this.pivotX = data.pivotX;
    this.pivotY = data.pivotY;

    this.direction;
    this.velocityX;
    this.velocityY;
  }

  move() {}

  update() {
    this.move();
  }
}
