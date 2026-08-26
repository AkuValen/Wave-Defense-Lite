// node (50 * 50)
const nodeSize = 50;

const node = {
  row: 0,
  column: 0,
  isOccupied: false,
  isSpawnpoint: false,
  isBasepoint: false,
  isOnlyPath: false,
};

export let mapGrid = [];
export let spawnpoint;
export let basepoint;
let mapRows;
let mapColumns;

export function newMap(gridNode, canvas) {
  mapRows = gridNode.row;
  mapColumns = gridNode.column;

  if (mapRows == null || mapColumns == null) {
    console.error(`Map rows atau columns kosong pada map.js`);
    return;
  }

  generateMap();
  setSpawn();
  setBase();
  drawMap(canvas);

  console.table(mapGrid);
}

function setSpawn() {
  const [posR, posC] = randomPos();

  mapGrid[posR - 1][posC - 1] = {
    ...mapGrid[posR - 1][posC - 1],
    isSpawnpoint: true,
  };

  spawnpoint = {
    row: posR,
    column: posC,
    pivotX: nodeSize * posC - nodeSize / 2,
    pivotY: nodeSize * posR - nodeSize / 2,
  };

  console.log(`Spawn pada titik r${posR}c${posC}`);
}

function setBase() {
  const [posR, posC] = randomPos();

  mapGrid[posR - 1][posC - 1] = {
    ...mapGrid[posR - 1][posC - 1],
    isBasepoint: true,
  };

  basepoint = {
    row: posR,
    column: posC,
    pivotX: nodeSize * posC - nodeSize / 2,
    pivotY: nodeSize * posR - nodeSize / 2,
  };

  console.log(`Base pada titik r${posR}c${posC}`);
}

function randomPos() {
  let posR, posC;

  // do {
  //   posR = Math.floor(Math.random() * mapRows) + 1;
  //   posC = Math.floor(Math.random() * mapColumns) + 1;
  // } while (mapGrid[posR - 1][posC - 1].isSpawnpoint || mapGrid[posR - 1][posC - 1].isBasepoint);

  while (true) {
    posR = Math.floor(Math.random() * mapRows) + 1;
    posC = Math.floor(Math.random() * mapColumns) + 1;

    if (spawnpoint != null) {
      const deviationR = Math.abs(spawnpoint.row - posR);
      const deviationC = Math.abs(spawnpoint.column - posC);
      const totalDeviation = deviationR + deviationC;

      if (totalDeviation <= 2) continue;
    }

    break;
  }

  return [posR, posC];
}

function generateMap() {
  for (let r = 0; r < mapRows; r++) {
    mapGrid[r] = [];

    for (let c = 0; c < mapColumns; c++) {
      mapGrid[r][c] = {
        ...node,
        row: r + 1,
        column: c + 1,
      };
    }
  }
}

export function drawMap(canvas) {
  if (canvas == null) {
    console.error(`Canvas kosong pada map.js`);
    return;
  }

  canvas.height = mapRows * nodeSize;
  canvas.width = mapColumns * nodeSize;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#d2d2d2";
  ctx.fillRect(0, 0, canvas.height, canvas.width);

  for (let r = 0; r < mapRows; r++) {
    for (let c = 0; c < mapColumns; c++) {
      const posX = c * nodeSize;
      const posY = r * nodeSize;
      const gap = 4;

      if (mapGrid[r][c].isSpawnpoint) {
        ctx.fillStyle = "#de6243";
      } else if (mapGrid[r][c].isBasepoint) {
        ctx.fillStyle = "#47c0dc";
      } else {
        ctx.fillStyle = "#47c667";
      }
      ctx.fillRect(posX + gap / 2, posY + gap / 2, nodeSize - gap, nodeSize - gap);
    }
  }
}
