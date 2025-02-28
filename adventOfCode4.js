const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode4Input.txt", {
  encoding: "utf-8",
});

cleanedInput = rawInput.split("\r\n").map((row) => row.split(""));

const numberOfXMASAt = (grid, y, x) => {
  let result = 0;
  const xmas = "XMAS";
  //forward
  for (let i = 1; i < xmas.length; i++) {
    if (grid[y]?.[x + i] !== xmas[i]) break;
    if (i === xmas.length - 1) result++;
  }
  //backwards
  for (let i = 1; i < xmas.length; i++) {
    if (grid[y]?.[x - i] !== xmas[i]) break;
    if (i === xmas.length - 1) result++;
  }
  //vertical - forwards
  for (let i = 1; i < xmas.length; i++) {
    if (grid[y + i]?.[x] !== xmas[i]) break;
    if (i === xmas.length - 1) result++;
  }
  //vertical - backWards
  for (let i = 1; i < xmas.length; i++) {
    if (grid[y - i]?.[x] !== xmas[i]) break;
    if (i === xmas.length - 1) result++;
  }
  //diag up-left
  for (let i = 1; i < xmas.length; i++) {
    if (grid[y - i]?.[x - i] !== xmas[i]) break;
    if (i === xmas.length - 1) result++;
  }
  //diag up-right
  for (let i = 1; i < xmas.length; i++) {
    if (grid[y - i]?.[x + i] !== xmas[i]) break;
    if (i === xmas.length - 1) result++;
  }
  //diag down-right
  for (let i = 1; i < xmas.length; i++) {
    if (grid[y + i]?.[x + i] !== xmas[i]) break;
    if (i === xmas.length - 1) result++;
  }
  //diag down-left
  for (let i = 1; i < xmas.length; i++) {
    if (grid[y + i]?.[x - i] !== xmas[i]) break;
    if (i === xmas.length - 1) result++;
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
