class TowerBulletType {
  constructor(tower, image) {
    this.tower = tower;

    this.atk = this.tower.atk;
    this.speed = 4;

    this.pivotX = this.tower.pivotX;
    this.pivotY = this.tower.pivotY;

    this.size = 8;
    this.image = image;

    this.isActive = true;
    this.isCollision = [];
  }

  getDistance(a, b) {
    const diffX = Math.abs(a.pivotX - b.pivotX);
    const diffY = Math.abs(a.pivotY - b.pivotY);

    return Math.sqrt(diffX ** 2 + diffY ** 2);
  }

  update() {}
  checkCollision() {}

  destroy() {
    this.isActive = false;
  }
}

export class Bullet extends TowerBulletType {
  constructor(tower, image) {
    super(tower, image);

    this.velocityX = Math.cos(tower.angle - Math.PI / 2) * this.speed;
    this.velocityY = Math.sin(tower.angle - Math.PI / 2) * this.speed;
  }

  update(game) {
    this.move(game);
  }

  move(game) {
    this.pivotX += this.velocityX;
    this.pivotY += this.velocityY;

    if (
      this.pivotX > game.canvas.width ||
      this.pivotX < 0 ||
      this.pivotY > game.canvas.height ||
      this.pivotY < 0
    ) {
      this.destroy();
    }
  }

  checkCollision(game) {
    const closestEnemy = game.enemySystem.activeEnemies.reduce((closest, enemy) => {
      return this.getDistance(enemy, this) < this.getDistance(closest, this) ? enemy : closest;
    });

    if (this.getDistance(closestEnemy, this) <= closestEnemy.size / 2 + this.size / 2) {
      this.isCollision.push(closestEnemy);

      if (!this.isPiercing) this.destroy();
    } else {
      this.isCollision = [];
    }
  }
}

export class Wave extends TowerBulletType {
  constructor(tower, image) {
    super(tower, image);
    this.blastedEnemy = [];
  }

  update(game) {
    this.blast(game);
  }

  blast(game) {
    this.size += this.speed * 2;
    // this.size += 10;

    if (this.size / 2 > game.map.nodeSize + game.map.nodeSize / 2) {
      this.destroy();
    }
  }

  checkCollision(game) {
    const newEnemyInRange = game.enemySystem.activeEnemies.filter((enemy) => {
      if (
        this.getDistance(enemy, this) <= enemy.size / 2 + this.size / 2 &&
        !this.blastedEnemy.includes(enemy)
      ) {
        this.blastedEnemy.push(enemy);
        return true;
      }
    });

    // return newEnemyInRange;
    if (newEnemyInRange.length > 0) {
      this.isCollision = newEnemyInRange;
    } else {
      this.isCollision = [];
    }
  }
}

export class Plasma extends TowerBulletType {
  constructor(tower, image) {
    super(tower, image);
    this.velocityX = Math.cos(tower.angle - Math.PI / 2) * this.speed;
    this.velocityY = Math.sin(tower.angle - Math.PI / 2) * this.speed;

    this.piercedEnemy = [];
  }

  update(game) {
    this.rail(game);
  }

  rail(game) {
    this.pivotX += this.velocityX;
    this.pivotY += this.velocityY;

    if (
      this.pivotX > game.canvas.width ||
      this.pivotX < 0 ||
      this.pivotY > game.canvas.height ||
      this.pivotY < 0
    ) {
      this.destroy();
    }
  }

  checkCollision(game) {
    const newEnemyInRail = game.enemySystem.activeEnemies.filter((enemy) => {
      if (
        this.getDistance(enemy, this) <= enemy.size / 2 + this.size / 2 &&
        !this.piercedEnemy.includes(enemy)
      ) {
        this.piercedEnemy.push(enemy);
        return true;
      }
    });

    if (newEnemyInRail.length > 0) {
      this.isCollision = newEnemyInRail;
    } else {
      this.isCollision = [];
    }
  }
}
