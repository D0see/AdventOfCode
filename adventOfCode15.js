const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode15Input.txt", {
  encoding: "utf-8",
});

const splittedByLines = rawInput.split("\r\n");

const separation = splittedByLines.indexOf("");

const board = splittedByLines
  .slice(0, separation)
  .map((line) => line.split(""));
const moves = splittedByLines
  .slice(separation + 1)
  .map((line) => line.split(""))
  .flat();

const initialPosition = {};

yLoop: for (let y = 0; y < board.length; y++) {
  for (let x = 0; x < board[0].length; x++) {
    if (board[y][x] === "@") {
      (initialPosition.posX = x), (initialPosition.posY = y);
      break yLoop;
    }
  }
}

const moveMap = {
  "^": {
    y: -1,
    x: 0,
  },
  ">": {
    y: 0,
    x: +1,
  },
  v: {
    y: +1,
    x: 0,
  },
  "<": {
    y: 0,
    x: -1,
  },
};

const updatePosition = (previousPos, nextPos) => {
  previousPos.posX = nextPos.posX;
  previousPos.posY = nextPos.posY;
};

const UpdateBoard = (board, previousPos, moveMap, move) => {
  const nextPos = {
    posY: previousPos.posY + moveMap[move].y,
    posX: previousPos.posX + moveMap[move].x,
  };
  // if next move leads to a wall
  if (board[nextPos.posY][nextPos.posX] === "#") return;
  // if next move leads to an empty space
  if (board[nextPos.posY][nextPos.posX] === ".") {
    board[nextPos.posY][nextPos.posX] = "@";
    board[previousPos.posY][previousPos.posX] = ".";
    updatePosition(previousPos, nextPos);
  }
  // if next move leads to a box
  if (board[nextPos.posY][nextPos.posX] === "O") {
    let offsetX = 0;
    let offsetY = 0;
    while (board[nextPos.posY + offsetY][nextPos.posX + offsetX] !== "#") {
      const currLookUp = board[nextPos.posY + offsetY][nextPos.posX + offsetX];
      if (currLookUp === ".") {
        board[nextPos.posY + offsetY][nextPos.posX + offsetX] = "O";
        board[nextPos.posY][nextPos.posX] = "@";
        board[previousPos.posY][previousPos.posX] = ".";
        updatePosition(previousPos, nextPos);
        break;
      }
      offsetX += moveMap[move].x;
      offsetY += moveMap[move].y;
    }
  }
};

for (const move of moves) {
  UpdateBoard(board, initialPosition, moveMap, move);
}

let result = 0;
for (let y = 0; y < board.length; y++) {
  for (let x = 0; x < board[0].length; x++) {
    if (board[y][x] === "O") result += 100 * y + x;
  }
}

console.log(result);
