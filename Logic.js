var generationsModel = {
    gridSize: 5,
    liveCellsCounter: 0,
    currGeneration: [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0]
    ],
    newGeneration: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ],
    createGridArray: function () {
        var arr = [];
        for (var i = 0; i < this.gridSize; i++) {
            for (var j = 0; j < this.gridSize; j++) {
                arr[i][j] = "";
            }
        }
        return arr;
    },
    getLiveNeighbours: function (x, y) {
        var liveCount = 0;
        liveCount += this.getCellState(x - 1, y - 1);
        liveCount += this.getCellState(x - 1, y);
        liveCount += this.getCellState(x - 1, y + 1);
        liveCount += this.getCellState(x, y + 1);
        liveCount += this.getCellState(x + 1, y + 1);
        liveCount += this.getCellState(x + 1, y);
        liveCount += this.getCellState(x + 1, y - 1);
        liveCount += this.getCellState(x, y - 1);
        return liveCount;
    },

    getCellState: function (x, y) {
        if (x < 0 || y < 0 || x >= this.gridSize || y >= this.gridSize) {
            return 0;
        } else if (this.currGeneration[x][y] === 1) {
            return 1;
        } else {
            return 0;
        }
    },

    getNextGeneration: function () {
        var neighboursCount = 0, state, newState;
        for (var y = 0; y < this.currGeneration.length; y++) {
            for (var x = 0; x < this.currGeneration[y].length; x++) {
                neighboursCount = this.getLiveNeighbours(x, y);
                state = this.getCellState(x, y);
                newState = 0;
                if (state === 1) {
                    if (neighboursCount === 2 || neighboursCount === 3) {
                        newState = 1;
                    } else if (neighboursCount > 3 || neighboursCount <= 1) {
                        newState = 0;
                    }
                } else {
                    if (neighboursCount === 3) {
                        newState = 1;
                    }
                }
                this.newGeneration[x][y] = newState;
            }
        }

        var tmp = this.currGeneration;
        this.currGeneration = this.newGeneration;
        this.newGeneration = tmp;
    },

    addFigureToGrid: function () {
        var table = document.getElementById("grid");
        for (var i = 0; i < this.currGeneration.length; i++) {
            for (var j = 0; j < this.currGeneration[i].length; j++) {
                if (this.currGeneration[i][j] === 1) {
                    table.rows[i].cells[j].setAttribute("class", "liveCell");
                }
            }
        }
    }
};

var view = {
    createGrid: function (rowsNum, colNum) {
        var table = document.createElement("table");
        table.setAttribute("id", "grid");
        var row, cell;

        for (var i = 0; i < rowsNum; i++) {
            row = table.insertRow(i);
            for (var j = 0; j < colNum; j++) {
                cell = row.insertCell(j);
            }
        }
        document.getElementById("playingField").appendChild(table);
    },

    updateGrid: function () {
        var table = document.getElementById("grid");
        for (var i = 0; i < model.gridSize; i++) {

        }
    }
};

        window.onload = init;
        function init() {
            view.createGrid(model.gridSize, model.gridSize);
            model.addFigureToGrid();
        }



