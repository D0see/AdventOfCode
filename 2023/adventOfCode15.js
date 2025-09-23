const fs = require("fs");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode15Input.txt", {
    encoding: "utf-8",
});

const parsedInput = rawInput.split(',');

let result = 0;

function calcHashValue(str) {
    let currentValue = 0;
    for (const char of str) {
        currentValue += char.charCodeAt(0);
        currentValue *= 17;
        currentValue %= 256;
    }
    return currentValue;
}

for (const str of parsedInput) {
    result += calcHashValue(str);
}

console.log(result);

// PART 2

const boxes = {};

for (const str of parsedInput) {
    let label = str.split(/(=|-)/)[0];
    let boxNum = calcHashValue(label);

    let rest = str.slice(label.length);

    boxes[boxNum] = !boxes[boxNum] ? [] : boxes[boxNum]; // creates box if it doesnt exist

    if (rest[0] === '-') {
        for (let i = 0; i < boxes[boxNum].length; i++) {
            if (boxes[boxNum][i][0] === label) {
                boxes[boxNum].splice(i, 1);
                break;
            }
        }
    } else {
        let hasFound = false;
        for (let i = 0; i < boxes[boxNum].length; i++) {
            if (boxes[boxNum][i][0] === label) {
                hasFound = true;
                boxes[boxNum].splice(i, 1, [label, rest[1]]);
                break;
            }
        }
        if (!hasFound) boxes[boxNum].push([label, rest[1]])
    }
}

let result2 = 0;

for (const boxNum of Object.keys(boxes)) {
    const currBox = boxes[boxNum];
    for (const [index, lens] of currBox.entries()) {
        result2 += (Number(boxNum) + 1) * (index + 1) * Number(lens[1]);
    }
}

console.log(result2);