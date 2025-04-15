const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode17Input.txt", {
  encoding: "utf-8",
});

const splittedByLines = rawInput.split("\r\n");
const separation = splittedByLines.indexOf("");
const registers = splittedByLines.slice(0, separation)
    .map(line => parseInt(line.split(':')[1]))
    .reduce((acc, val, index) => {
        acc[index + 1] = val;
        return acc;
    }, {});

const program = splittedByLines[splittedByLines.length - 1].split(': ')[1].split(',');

//PART 1