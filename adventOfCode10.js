const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode10Input.txt", {
  encoding: "utf-8",
});

const map = rawInput
  .split("\r\n")
  .map((row) => row.split("").map((num) => parseInt(num)));

const getNumberOfAccessible9s = (map, y, x, result = {}, currNum = 0) => {
  if (currNum === 9) return (result[`${y}-${x}`] = true);
  if (map[y]?.[x + 1] === currNum + 1) {
    getNumberOfAccessible9s(map, y, x + 1, result, currNum + 1);
  }
  if (map[y]?.[x - 1] === currNum + 1)
    getNumberOfAccessible9s(map, y, x - 1, result, currNum + 1);
  if (map[y + 1]?.[x] === currNum + 1) {
    getNumberOfAccessible9s(map, y + 1, x, result, currNum + 1);
  }
  if (map[y - 1]?.[x] === currNum + 1)
    getNumberOfAccessible9s(map, y - 1, x, result, currNum + 1);
  return Object.keys(result).length;
};

/*
const test =
  "89010123.78121874.87430965.96549874.45678903.32019012.01329801.10456732"
    .split(".")
    .map((row) => row.split("").map((num) => parseInt(num)));

console.log(getNumberOfAccessible9s(test, 0, 2));
*/

let result = 0;

for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[0].length; x++) {
    if (!map[y][x]) result += getNumberOfAccessible9s(map, y, x);
  }
}

console.log(result);
