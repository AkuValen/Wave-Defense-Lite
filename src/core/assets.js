export let enemyData;

export async function configGameData() {
  try {
    const response = await fetch("assets/data/enemies.json");
    const data = await response.json();

    enemyData = data.enemies;

    console.log(`Berhasil mengunduh ${enemyData.length} data enemies.json`);
  } catch (error) {
    console.error(`Gagal mengunduh data enemies.json pada assets.js`);
  }
}
