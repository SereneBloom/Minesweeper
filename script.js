// script.js  
const boardSize = 10;
const mineCount = 20;
let gameBoard = [];
let revealedCells = 0;
let flaggedCells = 0;
let gameOver = false;

function startGame() {
    gameBoard = [];
    revealedCells = 0;
    flaggedCells = 0;
    gameOver = false;
    document.getElementById('gameInfo').textContent = '';
    const table = document.getElementById('gameBoard');
    table.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        const row = document.createElement('tr');
        gameBoard[i] = [];
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('td');
            cell.onclick = () => revealCell(i, j);
            cell.oncontextmenu = (e) => {
                e.preventDefault();
                flagCell(i, j);
            };
            row.appendChild(cell);
            gameBoard[i][j] = { mine: false, revealed: false, flagged: false, value: 0 };
        }
        table.appendChild(row);
    }
    placeMines();
    calculateValues();
}

function placeMines() {
    let placedMines = 0;
    while (placedMines < mineCount) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        if (!gameBoard[row][col].mine) {
            gameBoard[row][col].mine = true;
            placedMines++;
        }
    }
}

function calculateValues() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (gameBoard[i][j].mine) continue;
            let adjacentMines = 0;
            for (let di = -1; di <= 1; di++) {
                for (let dj = -1; dj <= 1; dj++) {
                    const ni = i + di;
                    const nj = j + dj;
                    if (ni >= 0 && ni < boardSize && nj >= 0 && nj < boardSize && gameBoard[ni][nj].mine) {
                        adjacentMines++;
                    }
                }
            }
            gameBoard[i][j].value = adjacentMines;
        }
    }
}

function revealCell(row, col) {
    if (gameOver || gameBoard[row][col].revealed || gameBoard[row][col].flagged) return;
    gameBoard[row][col].revealed = true;
    const cell = document.getElementById('gameBoard').rows[row].cells[col];
    if (gameBoard[row][col].mine) {
        cell.classList.add('mine');
        gameOver = true;
        document.getElementById('gameInfo').textContent = '游戏结束！你踩到了地雷！';
        revealAllMines();
    } else {
        cell.textContent = gameBoard[row][col].value > 0 ? gameBoard[row][col].value : '';
        cell.classList.add('revealed');
        revealedCells++;
        if (revealedCells === boardSize * boardSize - mineCount) {
            document.getElementById('gameInfo').textContent = '恭喜你！你赢得了游戏！';
            gameOver = true;
        }
        if (gameBoard[row][col].value === 0) {
            for (let di = -1; di <= 1; di++) {
                for (let dj = -1; dj <= 1; dj++) {
                    const ni = row + di;
                    const nj = col + dj;
                    if (ni >= 0 && ni < boardSize && nj >= 0 && nj < boardSize && !gameBoard[ni][nj].revealed) {
                        revealCell(ni, nj);
                    }
                }
            }
        }
    }
}

function flagCell(row, col) {
    if (gameOver || gameBoard[row][col].revealed) return;
    gameBoard[row][col].flagged = !gameBoard[row][col].flagged;
    const cell = document.getElementById('gameBoard').rows[row].cells[col];
    if (gameBoard[row][col].flagged) {
        cell.classList.add('flag');
        flaggedCells++;
    } else {
        cell.classList.remove('flag');
        flaggedCells--;
    }
}

function revealAllMines() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (gameBoard[i][j].mine) {
                document.getElementById('gameBoard').rows[i].cells[j].classList.add('mine');
            }
        }
    }
}

// 当文档加载完成后，自动调用一次开始游戏函数  
document.addEventListener('DOMContentLoaded', startGame);