var generationsModel = {
    liveCellsCounter: 0,
    currGeneration: [[]],
    tmpGeneration: [[]],

    createEmptyGridArray: function (size) {
        var arr = [];
        // Creates all lines:
        for (var i = 0; i < size; i++) {
            // Creates an empty line
            arr.push([]);
            // Adds cols to the empty line:
            arr[i].push(new Array(size));
            for (var j = 0; j < size; j++) {
                // Initializes:
                arr[i][j] = 0;
            }
        }
        return arr;
    },

    createCurrAndTmpGenerationContainers: function () {
        this.currGeneration = this.createEmptyGridArray(view.gridSize);
        this.tmpGeneration = this.createEmptyGridArray(view.gridSize);
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
        if (x < 0 || y < 0 || x >= view.gridSize || y >= view.gridSize) {
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
                this.tmpGeneration[x][y] = newState;
            }
        }

        var tmp = this.currGeneration;
        this.currGeneration = this.tmpGeneration;
        this.tmpGeneration = tmp;
    }
};

var view = {
    gridSize: 20,

    createGrid: function (rowsNum, colNum) {
        var table = document.createElement("table");
        table.setAttribute("id", "grid");
        var row, cell;

        for (var i = 0; i < rowsNum; i++) {

            row = table.insertRow(i);
            row.setAttribute("id", i);
            for (var j = 0; j < colNum; j++) {
                cell = row.insertCell(j);
                cell.setAttribute("id", j)
            }
        }
        document.getElementById("playingField").appendChild(table);
    },

    addOnclickEventToCells: function () {
        var table = document.getElementById("grid");
        for (var i = 0; i < generationsModel.currGeneration.length; i++) {
            for (var j = 0; j < generationsModel.currGeneration[i].length; j++) {
                table.rows[i].cells[j].onclick = this.handleClick;
            }
        }
    },

    handleClick: function (e) {
        var x, y, cell = e.target, row;

        cell.setAttribute("class", "liveCell");
        row = cell.parentNode;
        y = row.getAttribute("id");
        x = e.srcElement.getAttribute("id");

        generationsModel.currGeneration[y][x] = 1;
        generationsModel.liveCellsCounter++;
        var startButton = document.getElementsByTagName("input")[0];
        startButton.focus();
    },

    updateGrid: function () {

        var table = document.getElementById("grid");
        this.cleanGrid();
        generationsModel.liveCellsCounter = 0;

        for (var i = 0; i < generationsModel.currGeneration.length; i++) {
            for (var j = 0; j < generationsModel.currGeneration[i].length; j++) {
                if (generationsModel.currGeneration[i][j] === 1) {
                    generationsModel.liveCellsCounter++;
                    table.rows[i].cells[j].setAttribute("class", "liveCell");
                }
            }
        }
    },

    cleanGrid: function () {
        var table = document.getElementById("grid");
        for (var i = 0; i < generationsModel.tmpGeneration.length; i++) {
            for (var j = 0; j < generationsModel.tmpGeneration[i].length; j++) {
                if (generationsModel.tmpGeneration[i][j] === 1) {
                    if (table.rows[i].cells[j].hasAttribute("class")) {
                        table.rows[i].cells[j].removeAttribute("class", "liveCell");
                    }
                }
            }
        }
    },

    displayMessage: function (message) {
        var field = document.getElementById("messageArea");
        field.innerHTML = message;
    }
};

var controller = {
    checkGameOver: function () {
        if (generationsModel.liveCellsCounter === 0) {
            return true;
        }
        return false;
    }
};

window.onload = init;
function init() {
    view.createGrid(view.gridSize, view.gridSize);
    resetGame();

    var startButton = document.getElementById("Start");
    startButton.onkeydown = handleKeyDown;
    startButton.onclick = handleButtonClick;
}

function resetGame() {
    view.displayMessage("Hello! Draw the body, press Start and see what will be!");
    generationsModel.createCurrAndTmpGenerationContainers();
    view.addOnclickEventToCells();
}

function handleButtonClick(e) {
    if (e.srcElement.getAttribute("id") === "Start") {

        timeInterval = setInterval(function () {
            if (controller.checkGameOver()) {
                view.displayMessage("Game over!");
                view.updateGrid();
                clearInterval(timeInterval);
                e.srcElement.setAttribute("id", "Start");
                setTimeout(function() {
                    resetGame(); }, 3000);
            } else {
                view.updateGrid();
                generationsModel.getNextGeneration();
                view.displayMessage("Live cells: " + generationsModel.liveCellsCounter);
            }
        }, 100);
        e.srcElement.setAttribute("id", "Stop");
    } else {
        e.srcElement.setAttribute("id", "Start");
        clearInterval(timeInterval);
    }
}

function handleKeyDown(e) {
    if (e.keyCode === 13) {
        e.srcElement.click();
        return false;
    }
}


