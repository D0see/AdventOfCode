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

/* TESTING 
const litteralRep = "00...111...2...333.44.5555.6666.777.888899"
  .split("")
  .map((num) => (num === "." ? null : parseInt(num)));

console.log(litteralRep);
*/

const findFittingSpace = (limit, length, arr) => {
  for (let i = 0; i < limit; i++) {
    if (arr[i] === null) {
      let spaceEnd = i;
      while (arr[spaceEnd] === null) spaceEnd++;
      const spaceLength = spaceEnd - i;
      if (length <= spaceLength) {
        return [i, spaceEnd];
      }
    }
  }
  return false;
};

const fillSpace = (spaceBounds, arr, length, num) => {
  for (let i = spaceBounds[0]; i < spaceBounds[0] + length; i++) {
    arr[i] = num;
  }
  return arr;
};

const eraseSlice = (arr, left, right) => {
  for (let i = left; i <= right; i++) {
    arr[i] = null;
  }
  return arr;
};

right = litteralRep.length - 1;

//get First Box
while (litteralRep[right] === null) right--;
rightLeft = right;
while (litteralRep[rightLeft - 1] === litteralRep[right]) rightLeft--;
let currBox = [rightLeft, right + 1];

while (right >= 0) {
  const spaceBounds = findFittingSpace(
    currBox[0],
    currBox[1] - currBox[0],
    litteralRep
  );
  if (spaceBounds) {
    fillSpace(
      spaceBounds,
      litteralRep,
      currBox[1] - currBox[0],
      litteralRep[currBox[0]]
    );
    eraseSlice(litteralRep, rightLeft, right);
  }
  rightLeft--;
  right = rightLeft;
  while (litteralRep[rightLeft - 1] === litteralRep[right] && rightLeft >= 0)
    rightLeft--;
  currBox = [rightLeft, right + 1];
}

let result2 = 0;

for (let i = 0; i <= litteralRep.length; i++) {
  if (litteralRep[i]) result2 += litteralRep[i] * i;
}

console.log(result2);
