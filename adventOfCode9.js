const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode9Input.txt", {
  encoding: "utf-8",
});

//PART 1 (naive implementation)

const litteralRep = [];
for (let i = 0; i < rawInput.length; i++) {
  if (i % 2) {
    for (let j = 0; j < parseInt(rawInput[i]); j++) litteralRep.push(null);
    continue;
  }
  for (let j = 0; j < parseInt(rawInput[i]); j++)
    litteralRep.push(Math.floor(i / 2));
}

/* TESTING
const litteralRep = "00...111...2...333.44.5555.6666.777.888899"
  .split("")
  .map((num) => (num === "." ? null : parseInt(num)));

console.log(litteralRep);
*/

let result = 0;

let right = litteralRep.length - 1;
while (!litteralRep[right]) right--;

for (let left = 0; left <= right; left++) {
  if (litteralRep[left] !== null) {
    result += litteralRep[left] * left;
    continue;
  }
  result += litteralRep[right] * left;
  do {
    right--;
  } while (litteralRep[right] === null);
}

console.log(result);

// PART 2

const testArr = "00...111...2...333.44.5555.6666.777.888899";

console.log(testArr);

let result2 = 0;

right = testArr.length - 1;

//get First Box
while (!testArr[right]) right--;
rightLeft = right;
while (testArr[rightLeft - 1] === testArr[right]) rightLeft--;
let currBox = [rightLeft, right + 1];
console.log(testArr.slice(currBox[0], currBox[1]));

right = rightLeft;
right--;
while (!testArr[right]) right--;
rightLeft = right;
while (testArr[rightLeft - 1] === testArr[right]) rightLeft--;
let currBox2 = [rightLeft, right + 1];
console.log(testArr.slice(currBox2[0], currBox2[1]));

// add an array that only contains the max possible space in case this function returns false
const findFittingSpace = (length, str) => {
  for (let i = 0; i < str.length; i++) {
    if (str[i] === ".") {
      let index = i;
      while (str[index] === ".") index++;
      const spaceLength = index - i;
      if (length <= spaceLength) {
        return [i, index];
      }
    }
  }
  return false;
};

console.log(findFittingSpace(2, testArr));

console.log(findFittingSpace(3, testArr));

console.log(findFittingSpace(4, testArr));
