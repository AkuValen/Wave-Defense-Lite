export class Map {
  constructor(game) {
    this.game = game;

    this.nodeSize = 50;
    this.mapData = {
      row: 10,
      column: 10,
      basepoint: null,
      spawnpoint: null,
    };

    this.tempGrid = [];
    this.mapGrid = [];
  }

  newMap() {
    this.#setMapNode();
    this.#setBase();
    this.#setSpawn();
    if (this.#checkValidation()) {
      this.#updateGridDistance();
    }
  }

  #setMapNode() {
    for (let r = 0; r < this.mapData.row; r++) {
      this.mapGrid[r] = [];
      for (let c = 0; c < this.mapData.column; c++) {
        this.mapGrid[r][c] = {
          distance: null,
          row: r + 1,
          column: c + 1,
          pivotX: this.nodeSize * c + this.nodeSize / 2,
          pivotY: this.nodeSize * r + this.nodeSize / 2,
          isOccupied: false,
          isBasepoint: false,
          isSpawnpoint: false,
        };
      }
    }
  }

  #setBase() {
    const posR = Math.ceil(Math.random() * this.mapData.row);
    const posC = Math.ceil(Math.random() * this.mapData.column);

    const node = this.mapGrid[posR - 1][posC - 1];

    node.isBasepoint = true;
    this.mapData.basepoint = node;

    console.log("Basepoint: ", node);
  }

  #setSpawn() {
    let posR, posC;

    while (true) {
      posR = Math.ceil(Math.random() * this.mapData.row);
      posC = Math.ceil(Math.random() * this.mapData.column);

      const deltaR = Math.abs(posR - this.mapData.basepoint.row);
      const deltaC = Math.abs(posC - this.mapData.basepoint.column);

      if (deltaR + deltaC <= 2) continue;

      break;
    }

    const node = this.mapGrid[posR - 1][posC - 1];

    node.isSpawnpoint = true;
    this.mapData.spawnpoint = node;

    console.log("Spawnpoint: ", node);
  }

  #checkValidation(buildNode) {
    this.tempGrid = structuredClone(this.mapGrid);

    for (let r = 0; r < this.mapData.row; r++) {
      for (let c = 0; c < this.mapData.column; c++) {
        this.tempGrid[r][c].distance = null;
      }
    }

    if (buildNode) {
      this.tempGrid[buildNode.row - 1][buildNode.column - 1].isOccupied = true;
    }

    let openSet = [this.mapData.basepoint];
    let isValid = false;

    this.tempGrid[this.mapData.basepoint.row - 1][this.mapData.basepoint.column - 1].distance = 0;

    while (openSet.length > 0) {
      const currentNode = openSet.reduce((lowestNode, node) => {
        return node.distance < lowestNode.distance ? node : lowestNode;
      }, openSet[0]);

      openSet = openSet.filter((node) => node !== currentNode);

      const neighborNode = [
        { r: currentNode.row - 1, c: currentNode.column },
        { r: currentNode.row, c: currentNode.column + 1 },
        { r: currentNode.row + 1, c: currentNode.column },
        { r: currentNode.row, c: currentNode.column - 1 },
      ];

      for (let n of neighborNode) {
        if (n.r < 1 || n.r > this.mapData.row || n.c < 1 || n.c > this.mapData.column) {
          continue;
        }

        const nNode = this.tempGrid[n.r - 1][n.c - 1];

        if (nNode.distance != null || nNode.isOccupied) {
          continue;
        }

        nNode.distance = currentNode.distance + 1;
        if (nNode.isSpawnpoint) {
          isValid = true;
          console.log("Map valid");
        }

        openSet.push(nNode);
      }
    }

    console.log("Cek valid: ");
    const printScore = this.tempGrid.map((row) => row.map((node) => node.distance));
    console.table(printScore);
    return isValid;
  }

  #updateGridDistance() {
    this.mapGrid = this.tempGrid;
  }

  renderMap(canvas, ctx) {
    canvas.height = this.mapData.row * this.nodeSize;
    canvas.width = this.mapData.column * this.nodeSize;

    ctx.fillStyle = "#d2d2d2";
    ctx.fillRect(0, 0, canvas.height, canvas.width);

    const gap = 4;

    for (let r = 0; r < this.mapData.row; r++) {
      for (let c = 0; c < this.mapData.column; c++) {
        const x = c * this.nodeSize + gap / 2;
        const y = r * this.nodeSize + gap / 2;

        if (this.mapGrid[r][c].isSpawnpoint) {
          ctx.fillStyle = "#de6243";
        } else if (this.mapGrid[r][c].isBasepoint) {
          ctx.fillStyle = "#3cbbd8";
        } else {
          ctx.fillStyle = "#47c667";
        }

        ctx.fillRect(x, y, this.nodeSize - gap, this.nodeSize - gap);
      }
    }
  }

  mapClick(input) {
    const clickedNode =
      this.mapGrid[Math.ceil(input.isClick.y / this.nodeSize) - 1][
        Math.ceil(input.isClick.x / this.nodeSize) - 1
      ];

    console.log("Node: ", clickedNode);

    if (this.game.towerSystem.isSelectTower) {
      if (clickedNode.isOccupied || clickedNode.isBasepoint || clickedNode.isSpawnpoint) {
        console.log("Not placeable");
        this.game.towerSystem.invalidBuild();
        return;
      }

      if (this.#checkValidation(clickedNode)) {
        this.#updateGridDistance();
        this.game.towerSystem.build(clickedNode);
      } else {
        console.log("Not valid");
        this.game.towerSystem.invalidBuild();
      }
    }
  }
}
