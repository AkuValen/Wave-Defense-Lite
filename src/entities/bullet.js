export class Bullet {
  constructor(data) {
    // this.damage = data.atk;
    this.damage = 100;

    console.log("Bullet: ", data);

    this.pivotX = data.pivotX;
    this.pivotY = data.pivotY;
    this.size = 10;
    this.speed = 8;

    this.velocityX = Math.cos(data.angle - Math.PI / 2) * this.speed;
    this.velocityY = Math.sin(data.angle - Math.PI / 2) * this.speed;

    this.isActive = true;
  }

  move() {
    this.pivotX += this.velocityX;
    this.pivotY += this.velocityY;

    // console.log("Bullet Move: ");
    // console.log(this);
  }
}
