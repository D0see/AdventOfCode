const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode3Input.txt", {
  encoding: "utf-8",
});

const regex = /mul\([0-9]*,[0-9]*\)/g;

// PART 1

const matches = [...rawInput.matchAll(regex)].map((match) => match[0]);

const mul = (a, b) => a * b;

let result = 0;

matches.forEach((match) => (result += eval(match)));

console.log(result);

// PART 2

const regexDo = /do\(\)/g;
const regexDont = /don't\(\)/g;

// [["method", index],...]
const matchesMethod = [
  ...rawInput.matchAll(regexDo),
  ...rawInput.matchAll(regexDont),
]
  .map((match) => [match[0], match.index])
  .sort((a, b) => a[1] - b[1]);

// [[stop execution at index, start execution at index]]
const skipRanges = [];

let currRangeStart;
for (const match of matchesMethod) {
  if (!currRangeStart && match[0] === "don't()") {
    currRangeStart = match[1];
  } else if (currRangeStart && match[0] === "do()") {
    skipRanges.push([currRangeStart, match[1]]);
    currRangeStart = undefined;
  }
}

const matches2 = [...rawInput.matchAll(regex)].map((match) => ({
  func: match[0],
  index: match.index,
}));

let result2 = 0;

matches2.forEach((match) => {
  if (
    skipRanges.some((range) => range[0] < match.index && match.index < range[1])
  )
    result2 += eval(match.func);
});

console.log(result2);
