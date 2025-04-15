const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode16Input.txt", {
  encoding: "utf-8",
});

const splittedByLines = rawInput.split("\r\n");

const board = splittedByLines.map(row => row.split(""));

//PART 1

//recursive function to get to E
const traverseBoard = (board, y, x, orientation, currResult, result, minScore = {}) => {
    if (result[0] && currResult > result[0]) return;

    if (board[y][x] === 'E') {
        if (!result[0]) result[0] = currResult;
        else if (currResult < result[0]) result[0] = currResult; 
    };

    if (minScore[`${y}-${x}`] <= (currResult)) {return;}
    minScore[`${y}-${x}`] = currResult;

    if (board[y - 1][x] !== '#') traverseBoard(board, y - 1, x, 'N', currResult + (orientation === 'N' ? 1 : 1001), result, minScore)
    if (board[y][x + 1] !== '#') traverseBoard(board, y, x + 1, 'E', currResult + (orientation === 'E' ? 1 : 1001), result, minScore)
    if (board[y + 1][x] !== '#') traverseBoard(board, y + 1, x, 'S', currResult + (orientation === 'S' ? 1 : 1001), result, minScore)
    if (board[y][x - 1] !== '#') traverseBoard(board, y, x - 1, 'W', currResult + (orientation === 'W' ? 1 : 1001), result, minScore)
}

let result = [0];
traverseBoard(board, board.length - 2, 1, 'E', 0, result);
console.log(result[0]);

//PART 2
const traverseBoardAndGetBestSquares = (board, y, x, orientation, currResult, result, bestSquares, minScore = {}, squareVisited = {}) => {
    if (result[0] && currResult > result[0]) return;
    if (board[y][x] === 'E') {
        console.log(currResult);
        if (!result[0]) {
            result[0] = currResult;
            bestSquares[result[0]] = squareVisited

        }
        else if (currResult < result[0]) {
            result[0] = currResult;
            bestSquares[result[0]] = squareVisited
        } 
        else if (currResult === result[0]) {
            for (const square of Object.keys(squareVisited)) {
                bestSquares[result[0]][square] = true;
            }
        }
    };

    if (minScore[`${y}-${x}`] < (currResult)) {return;}

    minScore[`${y}-${x}`] = currResult;
    squareVisited[`${y}-${x}`] = true;

    if (board[y - 1][x] !== '#') traverseBoardAndGetBestSquares(board, y - 1, x, 'N', currResult + (orientation === 'N' ? 1 : 1001), result, bestSquares, minScore, JSON.parse(JSON.stringify(squareVisited)))
    if (board[y][x + 1] !== '#') traverseBoardAndGetBestSquares(board, y, x + 1, 'E', currResult + (orientation === 'E' ? 1 : 1001), result, bestSquares, minScore, JSON.parse(JSON.stringify(squareVisited)))
    if (board[y + 1][x] !== '#') traverseBoardAndGetBestSquares(board, y + 1, x, 'S', currResult + (orientation === 'S' ? 1 : 1001), result, bestSquares, minScore, JSON.parse(JSON.stringify(squareVisited)))
    if (board[y][x - 1] !== '#') traverseBoardAndGetBestSquares(board, y, x - 1, 'W', currResult + (orientation === 'W' ? 1 : 1001), result, bestSquares, minScore, JSON.parse(JSON.stringify(squareVisited)))
}
//recursive function to get to E


const testBoard = [
    ['#','#','#','#','#','#','#','#','#'],
    ['#','.','.','#','.','.','.','.','E'],
    ['#','.','.','.','#','.','.','#','#'],
    ['#','S','#','.','.','.','.','#','#'],
    ['#','#','#','#','#','#','#','#','#']
]
const bestSquares = {};
let result2 = [0];
traverseBoardAndGetBestSquares(board, board.length - 2, 1, 'E', 0, result2, bestSquares);
console.log(result2[0]);
console.log(bestSquares[result2[0]])
console.log(Object.keys(bestSquares[result2[0]]).length);
