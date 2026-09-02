export let enemyData;
export let towerData;
export let bulletImg;

async function fetchTower() {
  try {
    const response = await fetch("assets/data/towers.json");
    const data = await response.json();

    towerData = data.towers;

    let tCounter = 0;

    for (let d of towerData) {
      tCounter++;

      d.image = new Image();
      d.image.src = "../../assets/img/" + d.texture;
    }

    console.log(`Berhasil mengunduh ${towerData.length} data dan ${tCounter} texture towers.json`);
  } catch (error) {
    console.error(`Gagal mengunduh data towers.json pada assets.js`);
  }
}

async function fetchEnemy() {
  try {
    const response = await fetch("assets/data/enemies.json");
    const data = await response.json();

    enemyData = data.enemies;

    console.log(`Berhasil mengunduh ${enemyData.length} data enemies.json`);
  } catch (error) {
    console.error(`Gagal mengunduh data enemies.json pada assets.js`);
  }
}

function preloadBullet() {
  bulletImg = new Image();
  bulletImg.src = "../../assets/img/bullet.png";
}

export async function configGameData() {
  await fetchEnemy();
  await fetchTower();
  preloadBullet();
}
