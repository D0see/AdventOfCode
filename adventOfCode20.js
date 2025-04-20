const fs = require('fs');

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync('./adventOfCode20Input.txt', {
  encoding: 'utf-8',
});

const splittedByLines = rawInput.split('\r\n');
const map = splittedByLines.map((row) => row.split(''));

const findPosition = (map, char) => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === char) return [y, x];
    }
  }
};

const [startY, startX] = findPosition(map, 'S');

// PART 1

// BFS
const findShortestPath = (map, y, x, alreadyVisited = {}) => {
  //initializes first square
  const memo = [[y, x, 0]];
  while (memo.length) {
    const [currY, currX, score] = memo.shift();
    if (map[currY][currX] === 'E') return score;
    alreadyVisited[`${currY}-${currX}`] = true;
    [
      [currY + 1, currX, score + 1],
      [currY, currX + 1, score + 1],
      [currY - 1, currX, score + 1],
      [currY, currX - 1, score + 1],
    ].forEach(([y, x, nextScore]) => {
      if (!map[y]?.[x] || map[y][x] === '#' || alreadyVisited[`${y}-${x}`]) return;
      memo.push([y, x, nextScore]);
    });
  }
  return 0;
};

// const fastestPathNoCheats = findShortestPath(map, startY, startX);

// let result = 0;

// for (let y = 1; y < map.length - 1; y++) {
//     for (let x = 1; x < map[0].length - 1; x++) {
//         if (map[y][x] !== '#') continue;
//         map[y][x] = '.';
//         const fastestPath = findShortestPath(map, startY, startX);
//         if ((fastestPathNoCheats - fastestPath) >= 100) result++;
//         map[y][x] = '#'
//     }
// }

// console.log(result);

// PART 2

// find the cost to reach every square from the start

//builds an hashmap of the cost of reaching every square from the start
const getCostToReachEverySquareFromStart = (inputtedMap) => {
  const map = JSON.parse(JSON.stringify(inputtedMap));

  // removes the original ending
  const [startY, startX] = findPosition(map, 'S');
  const [endingY, endingX] = findPosition(map, 'E');
  map[endingY][endingX] = '.';
  const costToReachFromStart = {};
  for (let y = 1; y < map.length - 1; y++) {
    for (let x = 1; x < map[0].length - 1; x++) {
      if (map[y][x] === '#' || map[y][x] === 'S') continue;
      map[y][x] = 'E';
      const fastestPath = findShortestPath(map, startY, startX);
      costToReachFromStart[y]
        ? (costToReachFromStart[y][x] = fastestPath)
        : (costToReachFromStart[y] = { [x]: fastestPath });
      map[y][x] = '.';
    }
  }
  return costToReachFromStart;
};

// const costToReachFromStart = getCostToReachEverySquareFromStart(map);
// console.log(costToReachFromStart);

// // find the cost to reach the end from every square

//builds an hashmap of the cost of reaching the end from evert square
const getCostToReachEndFromSquare = (inputtedMap) => {
  const map = JSON.parse(JSON.stringify(inputtedMap));
  // removes the original start
  const [endingY, endingX] = findPosition(map, 'S');
  map[endingY][endingX] = '.';
  const costToReachEndFrom = {};
  for (let y = 1; y < map.length - 1; y++) {
    for (let x = 1; x < map[0].length - 1; x++) {
      if (map[y][x] === '#' || map[y][x] === 'E') continue;
      map[y][x] = 'S';
      const fastestPath = findShortestPath(map, y, x);
      costToReachEndFrom[y]
        ? (costToReachEndFrom[y][x] = fastestPath)
        : (costToReachEndFrom[y] = { [x]: fastestPath });
      map[y][x] = '.';
    }
  }
  return costToReachEndFrom;
};

// const costToReachEndFrom = getCostToReachEndFromSquare(map);
// console.log(costToReachEndFrom);

const test = [
  ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
  ['#', 'S', '.', '#', '.', '.', '.', '.', '.', '.', '#'],
  ['#', '.', '.', '.', '.', '.', '#', '.', '.', '.', '#'],
  ['#', '.', '.', '.', '.', '.', '#', '.', '.', 'E', '#'],
  ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
];

const test2 = [
  ['#', '#', '#', '#', '#', '#'],
  ['#', 'S', '#', '.', 'E', '#'],
  ['#', '.', '#', '.', '.', '#'],
  ['#', '.', '.', '.', '.', '#'],
  ['#', '#', '#', '#', '#', '#'],
];

const shortestPathScore = findShortestPath(map, startY, startX);
console.log(shortestPathScore);

const costToReachEverySquareFromStart = getCostToReachEverySquareFromStart(map);

const [mapStartY, mapStartX] = findPosition(map, 'S');
costToReachEverySquareFromStart[mapStartY]?.[mapStartX] === undefined
  ? (costToReachEverySquareFromStart[mapStartY][mapStartX] = 0)
  : (costToReachEverySquareFromStart[mapStartY] = { [mapStartX]: 0 });

//console.log(costToReachEverySquareFromStart);

const costToReachEndFromSquare = getCostToReachEndFromSquare(map);

const [mapEndY, mapEndX] = findPosition(map, 'E');
costToReachEndFromSquare[mapEndY]?.[mapEndX] === undefined
  ? (costToReachEndFromSquare[mapEndY][mapEndX] = 0)
  : (costToReachEndFromSquare[mapEndY] = { [mapEndX]: 0 });

//console.log(costToReachEndFromSquare);

const calculateShortCutsScores = (
  costToReachEverySquareFromStart,
  costToReachEndFromSquare,
  maxShortcutLen,
  minScore,
  map
) => {
  let result = 0;
  for (const originY of Object.keys(costToReachEverySquareFromStart)) {
    for (const originX of Object.keys(costToReachEverySquareFromStart[originY])) {
      // console.count('coord');
      for (let endingY = originY - maxShortcutLen; endingY <= originY + maxShortcutLen; endingY++) {
        if (endingY < 0 || endingY >= map.length) continue;
        for (
          let endingX = originX - maxShortcutLen;
          endingX <= originX + maxShortcutLen;
          endingX++
        ) {
          if (endingX < 0 || endingX >= map[0].length) continue;
          const currShortCutLen = Math.abs(originY - endingY) + Math.abs(originX - endingX);
          // console.log(originY, originX, ' - ', endingY, endingX);
          // console.log('currShortCutLen : ', currShortCutLen);
          if (
            currShortCutLen > maxShortcutLen ||
            costToReachEndFromSquare[endingY]?.[endingX] === undefined
          )
            continue;
          const score =
            costToReachEverySquareFromStart[originY][originX] +
            currShortCutLen +
            costToReachEndFromSquare[endingY][endingX];
          if (score <= minScore - 100) {
            // console.log(originY, '-', originX, ' --- ', endingY, '-', endingX);
            // console.log('score -> ', score);
            result++;
          }
        }
      }
    }
  }
  return result;
};

console.log(
  calculateShortCutsScores(
    costToReachEverySquareFromStart,
    costToReachEndFromSquare,
    20,
    shortestPathScore,
    map
  )
);
