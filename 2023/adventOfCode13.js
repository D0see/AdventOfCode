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

function findHorizontalMirrorLineY(twoDArr, lastMirror) {
    for (let y = 0; y < twoDArr.length - 1; y++) {
        if (
            twoDArr[y] === twoDArr[y + 1]
            && isValidHorizontalMirrorLine(twoDArr, y, y + 1)
            //used for part 2
            && lastMirror !== `H${y + 1}`
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

function findVerticalMirrorLineX(twoDArr, lastMirror) {
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
            //used for part 2
            && lastMirror !== `V${x + 1}`
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

const mirrorLinesFound = [];

for (const twoDArr of parsedInput) {
    const horizontalMirrorLineY = findHorizontalMirrorLineY(twoDArr);
    if (horizontalMirrorLineY !== undefined) {
        mirrorLinesFound.push(`H${horizontalMirrorLineY}`)
    } else {
        const verticalMirrorLineX = findVerticalMirrorLineX(twoDArr);
        mirrorLinesFound.push(`V${verticalMirrorLineX}`)
    }
}

let result2 = 0;

outerLoop: for (const [index, twoDArr] of parsedInput.entries()) {
    for (let y = 0; y < twoDArr.length; y++) {
        for (let x = 0; x < twoDArr[0].length; x++) {

            const currTwoDArr = structuredClone(twoDArr);
            currTwoDArr[y] = currTwoDArr[y].split('');
            currTwoDArr[y].splice(x, 1, currTwoDArr[y][x] === '#' ? '.' : '#');
            currTwoDArr[y] = currTwoDArr[y].join('');

            const horizontalMirrorLineY = findHorizontalMirrorLineY(currTwoDArr, mirrorLinesFound[index]);
            const verticalyMirrorLineX = findVerticalMirrorLineX(currTwoDArr, mirrorLinesFound[index]);

            if ((horizontalMirrorLineY !== undefined)) {
                result2 += horizontalMirrorLineY * 100;
                continue outerLoop;
            } else if ((verticalyMirrorLineX !== undefined)) {
                result2 += verticalyMirrorLineX;
                continue outerLoop;
            }
        }
    }
    console.count('notpassed')
}

console.log(result2);