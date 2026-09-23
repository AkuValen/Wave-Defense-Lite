export class BulletModel {
  constructor(data, image) {
    // this.damage = data.atk;
    this.atk = 100;
    this.speed = 4;

    this.pivotX = data.pivotX;
    this.pivotY = data.pivotY;
    this.size = 10;
    this.image = image;

    this.velocityX = Math.cos(data.angle - Math.PI / 2) * this.speed;
    this.velocityY = Math.sin(data.angle - Math.PI / 2) * this.speed;

    this.isActive = true;
  }

  move() {
    this.pivotX += this.velocityX;
    this.pivotY += this.velocityY;
  }
}
