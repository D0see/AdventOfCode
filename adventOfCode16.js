const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode16Input.txt", {
  encoding: "utf-8",
});

const splittedByLines = rawInput.split("\r\n");

const board = splittedByLines.map(row => row.split(""));

//PART 1

//recursive function to get to E
const traverseboard = (board, y, x, orientation, currResult, result, minScore = {}) => {

    if (board[y][x] === 'E') {
        if (!result[0]) result[0] = currResult;
        else if (currResult < result[0]) result[0] = currResult; 
    };

    if (minScore[`${y}-${x}`] <= (currResult)) {return;}
    minScore[`${y}-${x}`] = currResult;

    if (board[y - 1][x] !== '#') traverseboard(board, y - 1, x, 'N', currResult + (orientation === 'N' ? 1 : 1001), result, minScore)
    if (board[y][x + 1] !== '#') traverseboard(board, y, x + 1, 'E', currResult + (orientation === 'E' ? 1 : 1001), result, minScore)
    if (board[y + 1][x] !== '#') traverseboard(board, y + 1, x, 'S', currResult + (orientation === 'S' ? 1 : 1001), result, minScore)
    if (board[y][x - 1] !== '#') traverseboard(board, y, x - 1, 'W', currResult + (orientation === 'W' ? 1 : 1001), result, minScore)
}

let result = [0];
traverseboard(board, board.length - 2, 1, 'E', 0, result);
console.log(result[0]);