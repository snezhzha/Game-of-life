var GenerationsModel = function (arrSize) {
    this.liveCellsCounter = 0;
    this.currGeneration = [[]];
    this.tmpGeneration = [[]];
    this.arrSize = arrSize;
};
GenerationsModel.prototype.increaseLiveCellsCounter = function () {
    this.liveCellsCounter++;
};

GenerationsModel.prototype.setLiveCellsCounter = function (value) {
    this.liveCellsCounter = value;
};

GenerationsModel.prototype.getLiveCellsCounter = function () {
    return this.liveCellsCounter;
};

GenerationsModel.prototype.getCurrGeneration = function () {
    return this.currGeneration;
};

GenerationsModel.prototype.getTmpGeneration = function () {
    return this.tmpGeneration;
};

GenerationsModel.prototype.createEmptyGridArray = function () {
    var arr = [];
    // Creates all lines:
    for (var i = 0; i < this.arrSize; i++) {
        // Creates an empty line
        arr.push([]);
        // Adds cols to the empty line:
        arr[i].push(new Array(this.arrSize));
        for (var j = 0; j < this.arrSize; j++) {
            // Initializes:
            arr[i][j] = 0;
        }
    }
    return arr;
};

GenerationsModel.prototype.createCurrAndTmpGenerationContainers = function () {
    this.currGeneration = this.createEmptyGridArray(this.arrSize);
    this.tmpGeneration = this.createEmptyGridArray(this.arrSize);
};

GenerationsModel.prototype.getCellState = function (x, y) {
    if (x < 0 || y < 0 || x >= this.arrSize || y >= this.arrSize) {
        return 0;
    } else if (this.currGeneration[x][y] === 1) {
        return 1;
    } else {
        return 0;
    }
};

GenerationsModel.prototype.getLiveNeighbours = function (x, y) {
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
};

GenerationsModel.prototype.getNextGeneration = function () {
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
};

var View = function (gridSize) {
    this.gridSize = gridSize;
};

View.prototype.getGridSize = function () {
    return this.gridSize;
};

View.prototype.createGrid = function () {
    var table = document.createElement("table");
    table.setAttribute("id", "grid");
    var row, cell;

    for (var i = 0; i < this.gridSize; i++) {
        row = table.insertRow(i);
        row.setAttribute("id", i);
        for (var j = 0; j < this.gridSize; j++) {
            cell = row.insertCell(j);
            cell.setAttribute("id", j)
        }
    }
    document.getElementById("playingField").appendChild(table);
};

View.prototype.addOnclickEventToCells = function (generationsModel) {
    var table = document.getElementById("grid");
    for (var i = 0; i < generationsModel.getCurrGeneration().length; i++) {
        for (var j = 0; j < generationsModel.getCurrGeneration()[i].length; j++) {
            table.rows[i].cells[j].onclick = function (e) {
                var x, y, cell = e.target, row;

                cell.setAttribute("class", "liveCell");
                row = cell.parentNode;
                y = row.getAttribute("id");
                x = e.srcElement.getAttribute("id");

                generationsModel.getCurrGeneration()[y][x] = 1;
                generationsModel.liveCellsCounter++;
                var startButton = document.getElementsByTagName("input")[0];
                startButton.focus();
            }
        }
    }
};

View.prototype.updateGrid = function (generationsModel) {
    var table = document.getElementById("grid");
    this.cleanGrid(generationsModel);
    generationsModel.setLiveCellsCounter(0);

    for (var i = 0; i < generationsModel.currGeneration.length; i++) {
        for (var j = 0; j < generationsModel.currGeneration[i].length; j++) {
            if (generationsModel.currGeneration[i][j] === 1) {
                generationsModel.increaseLiveCellsCounter();
                table.rows[i].cells[j].setAttribute("class", "liveCell");
            }
        }
    }
};


View.prototype.cleanGrid = function (generationsModel) {
    var table = document.getElementById("grid");
    for (var i = 0; i < generationsModel.getTmpGeneration().length; i++) {
        for (var j = 0; j < generationsModel.getTmpGeneration()[i].length; j++) {
            if (generationsModel.getTmpGeneration()[i][j] === 1) {
                if (table.rows[i].cells[j].hasAttribute("class")) {
                    table.rows[i].cells[j].removeAttribute("class", "liveCell");
                }
            }
        }
    }
};

function iterate(arr, testFunction) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            testFunction(arr[i][j], i, j);
        }
    }
}

View.prototype.displayMessage = function (message) {
    var field = document.getElementById("messageArea");
    field.innerHTML = message;
};

var Controller = function () {
};
Controller.prototype.checkGameOver = function (counter) {
    if (counter === 0) {
        return true;
    }
    return false;
};

window.onload = init;
function init() {
    var playingFieldSize = 20;
    var MyView = new View(playingFieldSize);
    var MyGenerationsModel = new GenerationsModel(playingFieldSize);
    var MyController = new Controller();
    var startButton = document.getElementById("Start");

    MyView.createGrid();
    resetGame(MyView, MyGenerationsModel);


    startButton.onkeydown = function (e) {
        var enterKey = 13;
        if (e.keyCode === enterKey) {
            e.srcElement.click();
            return false;
        }
    };

    startButton.onclick = function (e) {
        if (e.srcElement.getAttribute("id") === "Start") {

            timeInterval = setInterval(function () {
                if (MyController.checkGameOver(MyGenerationsModel.getLiveCellsCounter())) {
                    MyView.displayMessage("Game over!");

                    MyView.updateGrid(MyGenerationsModel);
                    clearInterval(timeInterval);
                    e.srcElement.setAttribute("id", "Start");
                    setTimeout(function () {
                        resetGame(MyView, MyGenerationsModel);
                    }, 3000);
                } else {

                    MyView.updateGrid(MyGenerationsModel);
                    MyGenerationsModel.getNextGeneration();
                    MyView.displayMessage("Live cells: " + MyGenerationsModel.getLiveCellsCounter());
                }
            }, 100);
            e.srcElement.setAttribute("id", "Stop");
        } else {
            e.srcElement.setAttribute("id", "Start");
            clearInterval(timeInterval);
        }
    };
}

function resetGame(View, GenerationsModel) {
    View.displayMessage("Hello! Draw the body, press Start and see what will be!");
    GenerationsModel.createCurrAndTmpGenerationContainers();
    View.addOnclickEventToCells(GenerationsModel);
}



