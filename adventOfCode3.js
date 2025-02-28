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

let currRange = [];
for (const match of matchesMethod) {
  if (!currRange.length && match[0] === "don't()") {
    currRange[0] = match[1];
  } else if (currRange.length === 1 && match[0] === "do()") {
    currRange[1] = match[1];
    skipRanges.push([...currRange]);
    currRange = [];
  }
}
if (currRange.length) skipRanges.push(currRange);

const matches2 = [...rawInput.matchAll(regex)].map((match) => [
  match[0],
  match.index,
]);

let result2 = 0;

const isNotInRanges = (index, ranges) => {
  for (const range of ranges) {
    if (index > range[0] && index < range[1]) {
      return false;
    }
  }
  return true;
};

matches2.forEach((match) => {
  if (isNotInRanges(match[1], skipRanges)) {
    result2 += eval(match[0]);
  }
});

console.log(result2);
