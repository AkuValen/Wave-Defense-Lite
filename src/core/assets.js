export let enemyData;

export async function configGameData() {
  try {
    const response = await fetch("assets/data/enemies.json");
    const data = await response.json();

    console.log("Berhasil mengunduh data enemies.json");
    enemyData = data.enemies;
  } catch (error) {
    console.error("Gagal mengunduh data enemies.json pada assets.js");
  }
}
