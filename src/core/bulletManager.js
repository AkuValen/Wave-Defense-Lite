let bullets = [];

function update() {
  bullets.forEach((bullet) => {
    bullet.update();
  });
}

function spawn() {
  bullets.push({
    atk: 100,
    pivotX: 0,
    pivotY: 0,
  });
}
