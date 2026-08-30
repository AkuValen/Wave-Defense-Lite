// Breadth-First Search (BFS)
function setScore(game) {
  const row = game.mapData.row;
  const column = game.mapData.column;

  const mapGrid = game.mapGrid;

  for (let r = 0; r < row; r++) {
    for (let c = 0; c < column; c++) {
      if (mapGrid[r] && mapGrid[r][c]) {
        mapGrid[r][c].gScore = null;
      }
    }
  }

  const basepoint = game.mapData.basepoint;
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
      if (n.r < 1 || n.r > row || n.c < 1 || n.c > column) {
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

function setSpawn(game) {
  const [posR, posC] = randomPos(game);

  const mapGrid = game.mapGrid;

  mapGrid[posR - 1][posC - 1] = {
    ...mapGrid[posR - 1][posC - 1],
    isSpawnpoint: true,
  };

  const mapData = game.mapData;
  mapData.spawnpoint = mapGrid[posR - 1][posC - 1];

  console.log(`Spawn pada titik r${posR}c${posC}`);
}

function setBase(game) {
  const [posR, posC] = randomPos(game);

  const mapGrid = game.mapGrid;

  mapGrid[posR - 1][posC - 1] = {
    ...mapGrid[posR - 1][posC - 1],
    isBasepoint: true,
  };

  const mapData = game.mapData;
  mapData.basepoint = mapGrid[posR - 1][posC - 1];

  console.log(`Base pada titik r${posR}c${posC}`);
}

function randomPos(game) {
  let posR, posC;

  const row = game.mapData.row;
  const column = game.mapData.column;

  while (true) {
    posR = Math.floor(Math.random() * row) + 1;
    posC = Math.floor(Math.random() * column) + 1;

    const spawnpoint = game.mapData.spawnpoint;

    if (spawnpoint != null) {
      const diffR = Math.abs(spawnpoint.row - posR);
      const diffC = Math.abs(spawnpoint.column - posC);
      const gridDistance = diffR + diffC;

      if (gridDistance <= 2) continue;
    }

    break;
  }

  return [posR, posC];
}

function generateMap(game) {
  const row = game.mapData.row;
  const column = game.mapData.column;

  const mapGrid = game.mapGrid;
  const nodeSize = game.mapData.nodeSize;

  for (let r = 0; r < row; r++) {
    mapGrid[r] = [];

    for (let c = 0; c < column; c++) {
      mapGrid[r][c] = {
        row: r + 1,
        column: c + 1,
        pivotX: nodeSize * c + nodeSize / 2,
        pivotY: nodeSize * r + nodeSize / 2,
      };
    }
  }
}

export function drawMap(game) {
  const canvas = game.canvas;
  const ctx = game.ctx;

  const row = game.mapData.row;
  const column = game.mapData.column;
  const nodeSize = game.mapData.nodeSize;

  canvas.height = row * nodeSize;
  canvas.width = column * nodeSize;

  ctx.fillStyle = "#d2d2d2";
  ctx.fillRect(0, 0, canvas.height, canvas.width);

  const mapGrid = game.mapGrid;

  for (let r = 0; r < row; r++) {
    for (let c = 0; c < column; c++) {
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

export function updateMapScore(game) {
  setScore(game);
}

export function newMap(game) {
  generateMap(game);

  setSpawn(game);
  setBase(game);
  setScore(game);

  drawMap(game);
}
