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

const getGPSScore = (board, char) => {
  let result = 0;
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      if (board[y][x] === char) result += 100 * y + x;
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
console.log(getGPSScore(board, 'O'));

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

yLoop: for (let y = 0; y < doubledBoard.length; y++) {
  for (let x = 0; x < doubledBoard[0].length; x++) {
    if (doubledBoard[y][x] === "@") {
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
      let leftBracket = board[nextPos.posY][nextPos.posX + offsetX] === "[";
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

//recursive function to find all linked boxes in {[x-y] = true,...}, has "blocked" -> true if they cant be moved
const getLinkedBoxesPos = (boxesPushed, board, direction, y, x) => {
  if (boxesPushed["blocked"]) return;
  boxesPushed[`${y}-${x}`] = true;
  if (['[',']'].includes(board[y][x])) {
    if (!boxesPushed[`${y}-${x - 1}`] && board[y][x] === ']') getLinkedBoxesPos(boxesPushed, board, direction, y, x - 1);
    else if (!boxesPushed[`${y}-${x + 1}`] && board[y][x] === '[') getLinkedBoxesPos(boxesPushed, board, direction, y, x + 1);
  }
  if (['[',']'].includes(board[y + direction][x])) getLinkedBoxesPos(boxesPushed, board, direction, y + direction, x);
  else if (board[y + direction][x] === "#") boxesPushed["blocked"] = true;
}

const moveVertically = (board, previousPos, nextPos, move) => {
  const boxesPushed = {};
  const direction = (move === '^' ? -1 : 1)
  getLinkedBoxesPos(boxesPushed, board, direction, nextPos.posY, nextPos.posX);
  if (boxesPushed["blocked"]) return;
  let boxesPushedKeys = Object.keys(boxesPushed).map(coord => coord.split("-").map(num => parseInt(num)));
  if (move === '^') {
    boxesPushedKeys = boxesPushedKeys.sort((a, b) => a[0] - b[0])
  } else {
    boxesPushedKeys = boxesPushedKeys.sort((a, b) => b[0] - a[0])
  }

  for (const coord of boxesPushedKeys) {
    const [y, x] = coord;
    board[y + direction][x] = board[y][x];
    board[y][x] = '.'
  }

  board[nextPos.posY][nextPos.posX] = "@";
  board[previousPos.posY][previousPos.posX] = ".";
  updatePosition(previousPos, nextPos);

}

const goToNextStep = (board, previousPos, moveMap, move) => {
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
  if (['[',']'].includes(board[nextPos.posY][nextPos.posX])) {
    switch (move) {
        case "^": 
          moveVertically(board, previousPos, nextPos, move);
          break;
        case ">":
          moveHorizontally(board, previousPos, nextPos, moveMap, move);
          break;
        case "v": 
          moveVertically(board, previousPos, nextPos, move);
          break;
        case "<":
          moveHorizontally(board, previousPos, nextPos, moveMap, move);
          break;
    }
  }
}

for (const move of moves) {
  goToNextStep(doubledBoard, startingPosition, moveMap, move);
}

//RESULT
console.log(getGPSScore(doubledBoard, '['));

// const stringified = doubledBoard.map(row => row.join("")).join("\r\n");
// for (const row of doubledBoard) {
//   fs.writeFileSync("./test.txt", stringified, {
//     encoding: "utf-8",
//   });
// }


// const testRow = [["#","#","#","#","#","#","#","#","#","#","#","#","#","#",],
//                 ["#","#",".",".",".",".",".",".",".",".",".",".","#","#"],
//                 ["#","#",".",".",".",".","[","]",".",".",".",".","#","#",],
//                 ["#","#",".",".",".","[","]","[","]","#",".",".","#","#",],
//                 ["#","#",".",".","[","]","[","]","[","]",".",".","#","#",],
//                 ["#","#",".",".",".",".",".","@",".",".",".",".","#","#",],
//                 ["#","#","#","#","#","#","#","#","#","#","#","#","#","#",]];
// const testMoves = ['^'];

// const testInitialPos = {posX: 7,posY: 5,}
// for (const move of testMoves) {
//   goToNextStep(testRow, testInitialPos, moveMap, move)
// }

// const stringified = testRow.map(row => row.join("")).join("\r\n");
// for (const row of testRow) {
//   fs.writeFileSync("./test.txt", stringified, {
//     encoding: "utf-8",
//   });
// }


// console.log(testRow)
//----------------------------------------------------

// const testBoard2 = [["@","[","]","[","]",".",".","#"]]

// const testMoves2 = ['>','>','>'];

// const testInitialPos = {posX: 0,posY: 0,}
// for (const move of testMoves2) {
//   goToNextStep(testBoard2, testInitialPos, moveMap, move);
//   console.log(testBoard2)
// }

//----------------------------------------------------

// const testBoard2 = [["#",".","[","]",".","[","]",".","@"]]

// const testMoves2 = ['<','<','<'];

// const testInitialPos = {posX: 8,posY: 0,}
// for (const move of testMoves2) {
//   goToNextStep(testBoard2, testInitialPos, moveMap, move);
//   console.log(testBoard2)
// }

//----------------------------------------------------


// const testMoves3 = ["<","v","v","<","<","^","^","<","<","^","^"];
// let testBoard3 = "##############/##......##..##/##..........##/##....[][]@.##/##....[]....##/##..........##/##############";
// testBoard3 = testBoard3.split("/").map(row => row.split(""));

// const testInitialPos = {posX: 10,posY: 3,}
// for (const move of testMoves3) {
//   goToNextStep(testBoard3, testInitialPos, moveMap, move);
// }
// console.log(testBoard3)