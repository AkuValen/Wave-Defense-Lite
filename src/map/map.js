// node (50 * 50)
export const nodeSize = 50;

export let mapGrid = [];
export let spawnpoint;
export let basepoint;
export const map = {
  row: 10,
  column: 10,
};

// Breadth-First Search (BFS)
function setScore() {
  for (let r = 0; r < map.row; r++) {
    for (let c = 0; c < map.column; c++) {
      if (mapGrid[r] && mapGrid[r][c]) {
        mapGrid[r][c].gScore = null;
      }
    }
  }

  let openSet = [basepoint];

  basepoint.gScore = 0;

  while (openSet.length > 0) {
    const currentNode = openSet.reduce((lowestNode, node) => {
      return node.gScore < lowestNode.gScore ? node : lowestNode;
    }, openSet[0]);

    openSet = openSet.filter((node) => node !== currentNode);

    const neighborNode = [
      { r: currentNode.row - 1, c: currentNode.column },
      { r: currentNode.row, c: currentNode.column + 1 },
      { r: currentNode.row + 1, c: currentNode.column },
      { r: currentNode.row, c: currentNode.column - 1 },
    ];

    for (let n of neighborNode) {
      if (n.r < 1 || n.r > map.row || n.c < 1 || n.c > map.column) {
        continue;
      }

      const nNode = mapGrid[n.r - 1][n.c - 1];

      if (nNode.gScore != null || nNode.isOccupied) {
        continue;
      }

      nNode.gScore = currentNode.gScore + 1;

      openSet.push(nNode);
    }
  }
}

function setSpawn() {
  const [posR, posC] = randomPos();

  mapGrid[posR - 1][posC - 1] = {
    ...mapGrid[posR - 1][posC - 1],
    isSpawnpoint: true,
    pivotX: nodeSize * posC - nodeSize / 2,
    pivotY: nodeSize * posR - nodeSize / 2,
  };

  spawnpoint = mapGrid[posR - 1][posC - 1];

  console.log(`Spawn pada titik r${posR}c${posC}`);
}

function setBase() {
  const [posR, posC] = randomPos();

  mapGrid[posR - 1][posC - 1] = {
    ...mapGrid[posR - 1][posC - 1],
    isBasepoint: true,
    pivotX: nodeSize * posC - nodeSize / 2,
    pivotY: nodeSize * posR - nodeSize / 2,
  };

  basepoint = mapGrid[posR - 1][posC - 1];

  console.log(`Base pada titik r${posR}c${posC}`);
}

function randomPos() {
  let posR, posC;

  while (true) {
    posR = Math.floor(Math.random() * map.row) + 1;
    posC = Math.floor(Math.random() * map.column) + 1;

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
  for (let r = 0; r < map.row; r++) {
    mapGrid[r] = [];

    for (let c = 0; c < map.column; c++) {
      mapGrid[r][c] = {
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

  canvas.height = map.row * nodeSize;
  canvas.width = map.column * nodeSize;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#d2d2d2";
  ctx.fillRect(0, 0, canvas.height, canvas.width);

  for (let r = 0; r < map.row; r++) {
    for (let c = 0; c < map.column; c++) {
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

export async function newMap(canvas) {
  generateMap();

  setSpawn();
  setBase();
  setScore();

  drawMap(canvas);

  const printScore = mapGrid.map((row) => row.map((node) => node.gScore));
  console.table(printScore);
}
