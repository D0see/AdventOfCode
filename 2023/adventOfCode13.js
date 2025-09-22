const fs = require("fs");
const { parse } = require("path");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode13Input.txt", {
    encoding: "utf-8",
});

const parsedInput = rawInput
.split('\r\n').map(str => !str ? '-' : str)
.join('\r\n')
.split('-')
.map(arr => arr.split('\r\n').filter(arr => arr));

console.log(parsedInput)

function isValidHorizontalMirrorLine(twoDArr, y) {
    let top = y;
    let bottom = y + 1;
    while(top >= 0 && bottom < twoDArr.length) {
        if (twoDArr[top] !== twoDArr[bottom]) {
            return false; 
        }
        top--;
        bottom++;
    }
    return true;
}

function findHorizontalMirrorLineY(twoDArr) {
    for (let y = 0; y < twoDArr.length - 1; y++) {
        if (
            twoDArr[y] === twoDArr[y + 1]
            && isValidHorizontalMirrorLine(twoDArr, y, y + 1)
        )  {
            return y + 1;
        } 
    }
}

function isValidVerticalMirrorLine(twoDArr, x) {
    let left = x;
    let right = x + 1;
    while(left >= 0 && right < twoDArr[0].length) {
        let currRow = [];
        let nextRow = [];
        for (let y = 0; y < twoDArr.length; y++) {
            currRow.push(twoDArr[y][left]);
            nextRow.push(twoDArr[y][right]);
        }
        if (currRow.join('') !== nextRow.join('')) {
            return false; 
        }
        left--;
        right++;
    }
    return true;
}

function findVerticalMirrorLineX(twoDArr) {
    for (let x = 0; x < twoDArr[0].length - 1; x++) {
        let currRow = [];
        let nextRow = [];
        for (let y = 0; y < twoDArr.length; y++) {
            currRow.push(twoDArr[y][x]);
            nextRow.push(twoDArr[y][x + 1]);
        }
        if (
            currRow.join('') === nextRow.join('')
            && isValidVerticalMirrorLine(twoDArr, x)
        )  {
            return x + 1;
        } 
    }
}

let result = 0;

for (const twoDArr of parsedInput) {
    const horizontalMirrorLineY = findHorizontalMirrorLineY(twoDArr);
    if (horizontalMirrorLineY !== undefined) {
        result += horizontalMirrorLineY * 100;
    } else {
        result += findVerticalMirrorLineX(twoDArr);
    }
}

console.log(result);

//PART 2

//im guessing brute force and test flipping the char for every possible space ?