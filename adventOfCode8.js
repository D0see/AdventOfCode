const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode8Input.txt", {
  encoding: "utf-8",
});

const matrix = rawInput.split("\r\n").map((line) => line.split(""));

//AntennaSymbol -> position map
const antennaPos = {};
for (let y = 0; y < matrix.length; y++) {
  for (let x = 0; x < matrix[0].length; x++) {
    //if (matrix[y][x] !== '.') antennaPos[matrix[y][x]]  ? antennaPos[`${y}-${x}`][y,x]
  }
}

console.log(matrix);
