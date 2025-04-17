const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode20Input.txt", {
  encoding: "utf-8",
});

const splittedByLines = rawInput.split("\r\n");
const map = splittedByLines.map((row) => row.split(""));

const findPosition = (map, char) => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === char) return [y, x];
    }
  }
};

const [startY, startX] = findPosition(map, "S");

// PART 1

// BFS
const findShortestPath = (map, y, x, alreadyVisited = {}) => {
  //initializes first square
  const memo = [[y, x, 0]];
  while (memo.length) {
    const [currY, currX, score] = memo.shift();
    if (map[currY][currX] === "E") return score;
    alreadyVisited[`${currY}-${currX}`] = true;
    [
      [currY + 1, currX, score + 1],
      [currY, currX + 1, score + 1],
      [currY - 1, currX, score + 1],
      [currY, currX - 1, score + 1],
    ].forEach(([y, x, nextScore]) => {
      if (!map[y]?.[x] || map[y][x] === "#" || alreadyVisited[`${y}-${x}`])
        return;
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
//         console.log(y," ", x)
//         map[y][x] = '.';
//         const fastestPath = findShortestPath(map, startY, startX);
//         if ((fastestPathNoCheats - fastestPath) >= 100) result++;
//         map[y][x] = '#'
//     }
// }

// console.log(result);

// PART 2

// find the cost to reach every square from the start

const [endingY, endingX] = findPosition(map, "E");
// removes the original ending
map[endingY][endingX] = ".";

const costToReachFromStart = {};

//builds an hashmap of the cost of reaching every square from the start
for (let y = 1; y < map.length - 1; y++) {
  for (let x = 1; x < map[0].length - 1; x++) {
    if (map[y][x] === "#" || map[y][x] === "S") continue;
    map[y][x] = "E";
    const fastestPath = findShortestPath(map, startY, startX);
    costToReachFromStart[y]
      ? (costToReachFromStart[y][x] = fastestPath)
      : (costToReachFromStart[y] = { [x]: fastestPath });
    map[y][x] = ".";
  }
}
console.log(costToReachFromStart);

map[endingY][endingX] = "E";

// find the cost to reach the end from every square

// removes the original start
map[startY][startX] = ".";

const costToReachEndFrom = {};

//builds an hashmap of the cost of reaching the end from evert square
for (let y = 1; y < map.length - 1; y++) {
  for (let x = 1; x < map[0].length - 1; x++) {
    if (map[y][x] === "#" || map[y][x] === "E") continue;
    map[y][x] = "S";
    const fastestPath = findShortestPath(map, y, x);
    costToReachEndFrom[y]
      ? (costToReachEndFrom[y][x] = fastestPath)
      : (costToReachEndFrom[y] = { [x]: fastestPath });
    map[y][x] = ".";
  }
}
console.log(costToReachEndFrom);

map[startY][startX] = "S";
// find the lowest score when adding the first two (at most at 20 distance)

// const test = [
//   ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
//   ["#", "S", ".", "#", ".", ".", ".", ".", ".", ".", "#"],
//   ["#", ".", ".", ".", ".", ".", "#", ".", ".", ".", "#"],
//   ["#", ".", ".", ".", ".", ".", "#", ".", ".", "E", "#"],
//   ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
// ];

// const visitedInBestPath = findShortestPath(test, 1, 1);

// console.log(visitedInBestPath);
