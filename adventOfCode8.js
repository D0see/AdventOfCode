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

const getAntinodePosition = (antenna1, antenna2) => {
  return {
    y: antenna1.x + (antenna1.x - antenna2.x),
    x: antenna1.y + (antenna1.y - antenna2.y),
  };
};

const getAntinodesFor = (matrix, antennasPos) => {
  const resultingPositions = [];
  for (let i = 0; i < antennasPos.length; i++) {
    const currAntennaPos = {
      y: parseInt(antennasPos[i].split("-")[0]),
      x: parseInt(antennasPos[i].split("-")[1]),
    };
    for (let j = 0; j < antennasPos.length; j++) {
      if (i === j) continue;
      const currAntennaPos2 = {
        y: parseInt(antennasPos[j].split("-")[0]),
        x: parseInt(antennasPos[j].split("-")[1]),
      };
      const antinodePos = getAntinodePosition(currAntennaPos, currAntennaPos2);
      if (
        antinodePos.y < matrix.length &&
        antinodePos.y >= 0 &&
        antinodePos.x < matrix[0].length &&
        antinodePos.x >= 0
      ) {
        resultingPositions.push(antinodePos);
      }
    }
  }
  return resultingPositions;
};

// since antinodes can share a position with an antenna we collect them in a position -> antinodeSymbol map
const antinodeMap = {};

for (const key of Object.keys(antennaPos)) {
  const antinodesPositions = getAntinodesFor(matrix, antennaPos[key]);
  antinodesPositions.forEach((position) =>
    antinodeMap[`${position.y}-${position.x}`]
      ? antinodeMap[`${position.y}-${position.x}`].push(key)
      : (antinodeMap[`${position.y}-${position.x}`] = [key])
  );
}

const result = Object.keys(antinodeMap).length;
console.log(result);

//PART 2

const gCD = (a, b) => {
  if (b > a) return gCD(b, a);
  if (!(a % b)) return b;
  return gCD(b, a % b);
};

const getAntinodesPositions = (matrix, antenna1, antenna2) => {
  const result = [];
  let xDiff = antenna1.x - antenna2.x;
  let yDiff = antenna1.y - antenna2.y;
  const gCommonDenominator = gCD(Math.abs(xDiff), Math.abs(yDiff));
  xDiff /= gCommonDenominator;
  yDiff /= gCommonDenominator;

  let offset = 0;
  while (true) {
    const currXPos = antenna1.x + xDiff * offset;
    const currYPos = antenna1.y + yDiff * offset;
    if (
      currYPos >= matrix.length ||
      currYPos < 0 ||
      currXPos >= matrix[0].length ||
      currXPos < 0
    ) {
      break;
    }
    result.push({
      x: currXPos,
      y: currYPos,
    });
    offset++;
  }
  return result;
};

const getAntinodesFor2 = (matrix, antennasPos) => {
  const resultingPositions = [];
  for (let i = 0; i < antennasPos.length; i++) {
    const currAntennaPos = {
      y: parseInt(antennasPos[i].split("-")[0]),
      x: parseInt(antennasPos[i].split("-")[1]),
    };
    for (let j = 0; j < antennasPos.length; j++) {
      if (i === j) continue;
      const currAntennaPos2 = {
        y: parseInt(antennasPos[j].split("-")[0]),
        x: parseInt(antennasPos[j].split("-")[1]),
      };
      const antinodesPos = getAntinodesPositions(
        matrix,
        currAntennaPos,
        currAntennaPos2
      );
      resultingPositions.push(...antinodesPos);
    }
  }
  return resultingPositions;
};

// since antinodes can share a position with an antenna we collect them in a position -> antinodeSymbol map

const antinodeMap2 = {};

for (const key of Object.keys(antennaPos)) {
  const antinodesPositions = getAntinodesFor2(matrix, antennaPos[key]);
  antinodesPositions.forEach((position) =>
    antinodeMap2[`${position.y}-${position.x}`]
      ? antinodeMap2[`${position.y}-${position.x}`].push(key)
      : (antinodeMap2[`${position.y}-${position.x}`] = [key])
  );
}

const result2 = Object.keys(antinodeMap2).length;
console.log(result2);
