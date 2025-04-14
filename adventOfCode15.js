const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode15Input.txt", {
  encoding: "utf-8",
});

const splittedByLines = rawInput.split("\r\n");

const separation = splittedByLines.indexOf("");

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

const getGPSScore = (board) => {
  let result = 0;
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      if (board[y][x] === "O") result += 100 * y + x;
    }
  }
  return result;
}

//PART 1

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

for (const move of moves) UpdateBoard(board, initialPosition, moveMap, move);

// RESULT
console.log(getGPSScore(board));

// PART 2

// If the tile is #, the new map contains ## instead.
// If the tile is O, the new map contains [] instead.
// If the tile is ., the new map contains .. instead.
// If the tile is @, the new map contains @. instead.

const normalBoard = splittedByLines
  .slice(0, separation)
  .map((line) => line.split(""));

const doubledBoard = [];

normalBoard.forEach(row =>{
  const currRow = [];
  row.forEach(char => {
    switch(char) {
      case '#' :
        currRow.push('#','#');
        break;
      case 'O' :
        currRow.push('[',']');
        break;
      case '.' :
        currRow.push('.','.');
        break;
      case '@' :
        currRow.push('@','.');
        break;
    }
  })
  doubledBoard.push(currRow);
})


const startingPosition = {};

yLoop: for (let y = 0; y < board.length; y++) {
  for (let x = 0; x < board[0].length; x++) {
    if (board[y][x] === "@") {
      (startingPosition.posX = x), (startingPosition.posY = y);
      break yLoop;
    }
  }
}

const moveHorizontally = (board, previousPos, nextPos, moveMap, move) => {
  let offsetX = 0;
  while (board[nextPos.posY][nextPos.posX + offsetX] !== "#") {
    const currLookUp = board[nextPos.posY][nextPos.posX + offsetX];
    if (currLookUp === ".") {
      board[nextPos.posY][nextPos.posX + offsetX] = move === ">" ? "]" : "[";
      let leftBracket = board[nextPos.posY][nextPos.posX + offsetX] = "[";
      while (offsetX) {
        Math.sign(offsetX) === 1 ? offsetX-- : offsetX++; 
        board[nextPos.posY][nextPos.posX + offsetX] = leftBracket ? ']' : '[';
        leftBracket = !leftBracket;
      }
      board[nextPos.posY][nextPos.posX] = "@";
      board[previousPos.posY][previousPos.posX] = ".";
      updatePosition(previousPos, nextPos);
      break;
    }
    offsetX += moveMap[move].x;
  }
}

const goToNextStep = (board, previousPos, moveMap, move) => {
  const nextPos = {
    posY: previousPos.posY + moveMap[move].y,
    posX: previousPos.posX + moveMap[move].x,
  };
  console.log(nextPos)
  // if next move leads to a wall
  if (board[nextPos.posY][nextPos.posX] === "#") return;
  // if next move leads to an empty space
  if (board[nextPos.posY][nextPos.posX] === ".") {
    board[nextPos.posY][nextPos.posX] = "@";
    board[previousPos.posY][previousPos.posX] = ".";
    updatePosition(previousPos, nextPos);
  }
  // if next move leads to a box
  console.log(move, "move")
  console.log("next Symbol", board[nextPos.posY][nextPos.posX])
  if (['[',']'].includes(board[nextPos.posY][nextPos.posX])) {
    console.log("passes1")
    switch (move) {
        case "^": 
        case ">":
          moveHorizontally(board, previousPos, nextPos, moveMap, move);
          break;
        case "v": 
        case "<":
          moveHorizontally(board, previousPos, nextPos, moveMap, move);
          console.log("passes2")
          break;
    }
  }
}

const testRow = [["#","#",".",".",".",".","[","]","[","]","@",".","#","#"]];
const testMoves = ['<','<','<','<','<','<'];

const testInitialPos = {posX: 10,posY: 0,}
for (const move of testMoves) {goToNextStep(testRow, testInitialPos, moveMap, move)
  console.log(testRow)
}

