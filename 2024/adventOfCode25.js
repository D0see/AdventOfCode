const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode25Input.txt", {
  encoding: "utf-8",
});

const splittedByLines = rawInput.split("\r\n");

let keys = [];
let locks = [];

for (let i = 0; i < splittedByLines.length; i += 8) {
    const elem = splittedByLines.slice(i, i + 7);
    if (elem[0] === '#####') {
        locks.push(elem);
    } else {
        keys.push(elem);
    }
}

const elemToHeightArr = (elem) => {
    const resultArr = [];
    for (let x = 0; x < elem[0].length; x++) {
        let currHeight = 0;
        for (let y = 0; y < elem.length; y++) {
            currHeight += elem[y][x] === '#' ? 1 : 0;
        }
        resultArr.push(currHeight);
    }
    return resultArr;
    
}

[keys, locks] = [keys, locks].map(arr => arr.map(elem => elemToHeightArr(elem)));

const keyFitsLocks = (key, lock) => {
    for (let i = 0; i < key.length; i++) {
        if (key[i] + lock[i] > 7) return false;
    }
    return true;
}

let result = 0;

for (const key of keys) {
    for (const lock of locks) {
        if (keyFitsLocks(key, lock)) result++;
    }
}

console.log(result);