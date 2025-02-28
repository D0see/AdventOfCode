const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode1Input.txt", {
  encoding: "utf-8",
});

let firstCol = [];
let secondCol = [];

let splittedPair;
rawInput.split("\r\n").forEach((pair) => {
  splittedPair = pair.split("   ");
  firstCol.push(parseInt(splittedPair[0]));
  secondCol.push(parseInt(splittedPair[1]));
});

//PART 1

firstColSorted = firstCol.sort((a, b) => a - b);
secondColSorted = secondCol.sort((a, b) => a - b);

let result = 0;

firstColSorted.forEach(
  (val, index) => (result += Math.abs(val - secondColSorted[index]))
);

console.log(result);

//PART 2

let result2 = 0;

firstColStats = firstColSorted.reduce((acc, val) => {
  acc[val] ? acc[val]++ : (acc[val] = 1);
  return acc;
}, {});

secondColStats = secondColSorted.reduce((acc, val) => {
  acc[val] ? acc[val]++ : (acc[val] = 1);
  return acc;
}, {});

Object.keys(firstColStats).forEach((key) => {
  result2 += firstColStats[key] * parseInt(key) * (secondColStats[key] || 0);
});

console.log(result2);
