const fs = require("fs");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode3Input.txt", {
    encoding: "utf-8",
});

const grid = rawInput.split('\r\n');

let result = 0;

let isAdjacentNum = false;

for (let y = 0; y < grid.length; y++) {
    let currNum = '';
    for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x].match(/[0-9]/)) {
            if (!currNum) {
                if ([
                    grid[y - 1]?.[x - 1],
                    grid[y - 1]?.[x],
                    grid[y]?.[x - 1],
                    grid[y + 1]?.[x - 1],
                    grid[y + 1]?.[x]
                ].join('').match(/[^0-9\.]/)) isAdjacentNum = true;
            } else {
                if ([
                    grid[y - 1]?.[x],
                    grid[y + 1]?.[x]
                ].join('').match(/[^0-9\.]/)) isAdjacentNum = true;
            }
            currNum += grid[y][x];
        } else {
            if (currNum) {
                if ([
                    grid[y - 1]?.[x],
                    grid[y]?.[x],
                    grid[y + 1]?.[x]
                ].join('').match(/[^0-9\.]/)) isAdjacentNum = true;
                if (isAdjacentNum) {
                    result += Number(currNum);
                }
                currNum = '';
            }
            isAdjacentNum = false;
        }
    }
    if (currNum && isAdjacentNum) result += Number(currNum);
    currNum = '';
    isAdjacentNum = false;
}

console.log(result);

//PART 2

const gears = {};
let currGear = '';

for (let y = 0; y < grid.length; y++) {
    let currNum = '';
    for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x].match(/[0-9]/)) {
            if (!currNum) {
                [
                    [y - 1, x - 1],
                    [y - 1, x],
                    [y, x - 1],
                    [y + 1, x - 1],
                    [y + 1, x],
                ].forEach(([y, x]) => {
                    if (`${grid[y]?.[x]}`.match(/[*]/)) currGear = `${y}-${x}`
                })
            } else {
                [
                    [y - 1, x],
                    [y + 1, x]
                ].forEach(([y, x]) => {
                    if (`${grid[y]?.[x]}`.match(/[*]/)) currGear = `${y}-${x}`
                })
            }
            currNum += grid[y][x];
        } else {
            if (currNum) {
                [
                    [y - 1, x],
                    [y, x],
                    [y + 1, x]
                ].forEach(([y, x]) => {
                    if (`${grid[y]?.[x]}`.match(/[*]/)) currGear = `${y}-${x}`
                })
                if (currGear) {
                    gears[currGear] = gears[currGear] ? [...gears[currGear], Number(currNum)] : [Number(currNum)];
                }
                currNum = '';
            }
            currGear = '';
        }
    }
    if (currNum && currGear) gears[currGear] = gears[currGear] ? [...gears[currGear], Number(currNum)] : [Number(currNum)];
    currNum = '';
    currGear = '';
}

let result2 = 0;

for (const gear of Object.keys(gears)) {
    if (gears[gear].length === 2) {
        result2 += gears[gear][0] * gears[gear][1]
    }
}

console.log(result2);

//horrible code but i loved it