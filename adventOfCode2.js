const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode2Input.txt", {
    encoding: "utf-8",
});

const levels = rawInput.split("\r\n").map((level) => level.split(" ").map((num) => parseInt(num)));

// PART 1

const levelIsSafe = (level) => {
    let isIncr = true;
    if (level[0] > level[1]) isIncr = false;
    for (let i = 1; i < level.length; i++) {
        if ((level[i - 1] < level[i] && isIncr) || (level[i - 1] > level[i] && !isIncr)) {
            if (Math.abs(level[i - 1] - level[i]) <= 3) continue;
        }
        return false;
    }
    return true;
};

let result = 0;
levels.forEach((level) => {
    if (levelIsSafe(level)) result++;
});

console.log(result);

// PART 2

const levelIsSafeWithDampener = (level) => {
    let isIncr = true;
    if (level[0] > level[1]) isIncr = false;
    for (let i = 1; i < level.length; i++) {
        if ((level[i - 1] < level[i] && isIncr) || (level[i - 1] > level[i] && !isIncr)) {
            if (Math.abs(level[i - 1] - level[i]) <= 3) continue;
        }
        for (let i = 0; i < level.length; i++) {
            if (levelIsSafe(level.toSpliced(i, 1))) return true;
        }
        return false;
    }
    return true;
};

let result2 = 0;

levels.forEach((level) => {
    if (levelIsSafeWithDampener(level)) result2++;
});

console.log(result2);
