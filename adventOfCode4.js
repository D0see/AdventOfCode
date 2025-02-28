const { log } = require("console");
const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode4Input.txt", {
  encoding: "utf-8",
});

cleanedInput = rawInput.split("\r\n").map((row) => row.split(""));

// PART 1

const numberOfXMASAt = (grid, y, x) => {
  let result = 8;
  const xmas = "XMAS";
  //forward
  for (let i = 1; i < xmas.length; i++) {
    if (grid[y]?.[x + i] !== xmas[i]) {
      result--;
      break;
    }
  }
  //backwards
  for (let i = 1; i < xmas.length; i++) {
    if (grid[y]?.[x - i] !== xmas[i]) {
      result--;
      break;
    }
  }
  //vertical - forwards
  for (let i = 1; i < xmas.length; i++) {
    if (grid[y + i]?.[x] !== xmas[i]) {
      result--;
      break;
    }
  }
  //vertical - backWards
  for (let i = 1; i < xmas.length; i++) {
    if (grid[y - i]?.[x] !== xmas[i]) {
      result--;
      break;
    }
  }
  //diag up-left
  for (let i = 1; i < xmas.length; i++) {
    if (grid[y - i]?.[x - i] !== xmas[i]) {
      result--;
      break;
    }
  }
  //diag up-right
  for (let i = 1; i < xmas.length; i++) {
    if (grid[y - i]?.[x + i] !== xmas[i]) {
      result--;
      break;
    }
  }
  //diag down-right
  for (let i = 1; i < xmas.length; i++) {
    if (grid[y + i]?.[x + i] !== xmas[i]) {
      result--;
      break;
    }
  }
  //diag down-left
  for (let i = 1; i < xmas.length; i++) {
    if (grid[y + i]?.[x - i] !== xmas[i]) {
      result--;
      break;
    }
  }
  return result;
};

/* TESTING
console.log(
  numberOfXMASAt(
    [
      ["S", ".", ".", "S", ".", ".", "S"],
      [".", "A", ".", "A", ".", "A", "S"],
      [".", ".", "M", "M", "M", ".", "S"],
      ["S", "A", "M", "X", "M", "A", "S"],
      [".", ".", "M", "M", "M", ".", "S"],
      [".", "A", ".", "A", ".", "A", "S"],
      ["S", ".", ".", "S", ".", ".", "S"],
    ],
    3,
    3
  )
);
*/

let result = 0;

for (let y = 0; y < cleanedInput.length; y++) {
  for (let x = 0; x < cleanedInput[0].length; x++) {
    if (cleanedInput[y][x] === "X")
      result += numberOfXMASAt(cleanedInput, y, x);
  }
}

console.log(result);

// PART2

const isCenterOfXMAS = (grid, y, x) => {
  return (
    //diag up-left down-right is valid
    ["S", "M"].includes(grid[y + 1][x + 1]) &&
    ["S", "M"].includes(grid[y - 1][x - 1]) &&
    grid[y - 1][x - 1] !== grid[y + 1][x + 1] &&
    //diag up-right down-left is valid
    ["S", "M"].includes(grid[y - 1][x + 1]) &&
    ["S", "M"].includes(grid[y + 1][x - 1]) &&
    grid[y - 1][x + 1] !== grid[y + 1][x - 1]
  );
};

let result2 = 0;

// skips borders
for (let y = 1; y < cleanedInput.length - 1; y++) {
  for (let x = 1; x < cleanedInput[0].length - 1; x++) {
    if (cleanedInput[y][x] === "A")
      result2 += isCenterOfXMAS(cleanedInput, y, x) ? 1 : 0;
  }
}

console.log(result2);
