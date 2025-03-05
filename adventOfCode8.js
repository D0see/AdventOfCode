const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode8Input.txt", {
  encoding: "utf-8",
});

const matrix = rawInput.split("\r\n").map((line) => line.split(""));

//AntennaSymbol -> [...positions] map
const antennaPos = {};
for (let y = 0; y < matrix.length; y++) {
  for (let x = 0; x < matrix[0].length; x++) {
    if (matrix[y][x] !== ".")
      antennaPos[matrix[y][x]]
        ? antennaPos[matrix[y][x]].push(`${y}-${x}`)
        : (antennaPos[matrix[y][x]] = [`${y}-${x}`]);
  }
}

// since antinode can share a position with an antenna we collect them in a map
const antinodePos = {};

for (const key of Object.keys(antennaPos)) {
  const antinodesPositions = getAntinodesFor(matrix, antennaPos[key]);
}

console.log(antennaPos);
