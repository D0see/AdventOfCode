const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode6Input.txt", {
  encoding: "utf-8",
});

let matrix = rawInput.split("\r\n").map((line) => line.split(""));

const orientations = {
  "^": "UP",
  ">": "RIGHT",
  v: "DOWN",
  "<": "LEFT",
};

console.log(Object.keys(orientations));

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
let currGuardPos = getGuardPosition(matrix, orientations);
while (true) {
  const nextPos = getNextPosition(matrix, orientations, currGuardPos);
  //Check if next position is out of the matrix
  if (!matrix[nextPos[0]] || !matrix[0][nextPos[1]]) {
    console.log("leaving the matrix");
    markAsVisited(matrix, currGuardPos);
    break;
  }
  //Check if wall -> turn right -> continue;
  if (matrix[nextPos[0]][nextPos[1]] === "#") {
    turnRight(matrix, orientations, currGuardPos);
    continue;
  }

  //Moves the guard to the next square
  matrix[nextPos[0]][nextPos[1]] = matrix[currGuardPos[0]][currGuardPos[1]];
  matrix[currGuardPos[0]][currGuardPos[1]] = "X";
  currGuardPos = nextPos;
}

const result = matrix
  .flat()
  .reduce((acc, cell) => (acc += cell === "X" ? 1 : 0), 0);

console.log(result);
