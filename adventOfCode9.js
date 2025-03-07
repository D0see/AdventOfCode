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
