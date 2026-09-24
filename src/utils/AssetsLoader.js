const manifests = {
  images: {
    turret: "src/assets/img/turret.png",
    gatling_gun: "src/assets/img/gatling_gun.png",
    land_hammer: "src/assets/img/land_hammer.png",
    railgun: "src/assets/img/railgun.png",
    bullet: "src/assets/img/bullet.png",
  },
  data: {
    enemies: "src/assets/data/enemies.json",
    towers: "src/assets/data/towers.json",
  },
};

export class AssetsLoader {
  static images = {};
  static data = {};

  static async loadAsset() {
    try {
      const imagePromises = Object.entries(manifests.images).map(([key, path]) =>
        this._loadImage(key, path),
      );

      const jsonPromises = Object.entries(manifests.data).map(([key, path]) =>
        this._loadJson(key, path),
      );

      await Promise.all([...imagePromises, ...jsonPromises]);
    } catch (error) {
      console.error("Kesalahan pada AssetLoader:", error);
      throw error;
    }
  }

  static _loadImage(key, path) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        this.images[key] = img;
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Gagal memuat gambar: ${path}`));
    });
  }

  static async _loadJson(key, path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Gagal fetch JSON: ${path}`);
    const json = await response.json();
    this.data[key] = json;
    return json;
  }

  static getTowerData(key) {
    if (key) return this.data.towers[key];

    return this.data.towers;
  }

  static getEnemyData(key) {
    if (key) return this.data.enemies[key];

    return this.data.enemies;
  }

  static getTowerImage(key) {
    return this.images[key];
  }

  static getBulletImage() {
    return this.images["bullet"];
  }
}
