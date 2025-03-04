const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode6Input.txt", {
  encoding: "utf-8",
});

let matrix = JSON.stringify(rawInput.split("\r\n").map((line) => line.split("")));

const orientations = {
  "^": "UP",
  ">": "RIGHT",
  v: "DOWN",
  "<": "LEFT",
};

const getGuardPosition = (matrix, orientations) => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[0].length; x++) {
      if (orientations[matrix[y][x]]) return [y, x];
    }
  }
  return null;
};

const getNextPosition = (matrix, orientations, previousPos) => {
  let nextPos = [...previousPos];
  switch (orientations[matrix[previousPos[0]][previousPos[1]]]) {
    case "UP":
      nextPos[0]--;
      break;
    case "LEFT":
      nextPos[1]--;
      break;
    case "RIGHT":
      nextPos[1]++;
      break;
    case "DOWN":
      nextPos[0]++;
      break;
  }
  return nextPos;
};

const markAsVisited = (matrix, position) => {
  matrix[position[0]][position[1]] = "X";
};

const turnRight = (matrix, orientations, position) => {
  let orientationSymbol = matrix[position[0]][position[1]];
  const orientationsSymbols = [...Object.keys(orientations)];

  const currIndex = orientationsSymbols.indexOf(orientationSymbol);
  if (!orientationsSymbols[currIndex + 1]) {
    orientationSymbol = orientationsSymbols[0];
  } else {
    orientationSymbol = orientationsSymbols[currIndex + 1];
  }

  matrix[position[0]][position[1]] = orientationSymbol;
};

//GameLoop
const part1Matrix = JSON.parse(matrix);
let currGuardPos = getGuardPosition(part1Matrix, orientations);
while (true) {
  const nextPos = getNextPosition(part1Matrix, orientations, currGuardPos);
  //Check if next position is out of the matrix
  if (!part1Matrix[nextPos[0]] || !part1Matrix[0][nextPos[1]]) {
    markAsVisited(part1Matrix, currGuardPos);
    break;
  }
  //Check if wall -> turn right -> continue;
  if (part1Matrix[nextPos[0]][nextPos[1]] === "#") {
    turnRight(part1Matrix, orientations, currGuardPos);
    continue;
  }

  //Moves the guard to the next square
  part1Matrix[nextPos[0]][nextPos[1]] = part1Matrix[currGuardPos[0]][currGuardPos[1]];
  markAsVisited(part1Matrix, currGuardPos);
  currGuardPos = nextPos;
}

const result = part1Matrix
  .flat()
  .reduce((acc, cell) => (acc += cell === "X" ? 1 : 0), 0);

console.log(result);

//PART 2

/*

SUPER UN-OPTIMIZED

*/

const blockingCauseLoop = (matrix, position) => {
  matrix[position[0]][position[1]] = '#';

  let currGuardPos = getGuardPosition(matrix, orientations);
  const orientationsAtPos = {};
  while (true) {
    orientationsAtPos[`${currGuardPos[0]}-${currGuardPos[1]}`] ?
    orientationsAtPos[`${currGuardPos[0]}-${currGuardPos[1]}`][[matrix[currGuardPos[0]][currGuardPos[1]]]] = true :
    orientationsAtPos[`${currGuardPos[0]}-${currGuardPos[1]}`] = {[matrix[currGuardPos[0]][currGuardPos[1]]] : true};

    const nextPos = getNextPosition(matrix, orientations, currGuardPos);
    //Check if next position is out of the matrix
    if (!matrix[nextPos[0]] || !matrix[0][nextPos[1]]) return false;

    //Check if wall -> turn right -> continue;
    if (matrix[nextPos[0]][nextPos[1]] === "#") {
      turnRight(matrix, orientations, currGuardPos);
      continue;
    }

    //Moves the guard to the next square
    if (orientationsAtPos[`${nextPos[0]}-${nextPos[1]}`]?.[matrix[currGuardPos[0]][currGuardPos[1]]]) return true;
    matrix[nextPos[0]][nextPos[1]] = matrix[currGuardPos[0]][currGuardPos[1]];
    currGuardPos = nextPos;
  }
}

const part2Matrix = JSON.parse(matrix);
let result2 = 0;
for (let y = 0; y < part2Matrix.length; y++) {
  for (let x = 0; x < part2Matrix[0].length; x++) {
    if (part2Matrix[y][x] === '.' && blockingCauseLoop(JSON.parse(matrix), [y, x])) result2++;
  }
}

console.log(result2);