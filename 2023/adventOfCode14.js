const fs = require("fs");
const { parse } = require("path");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode14Input.txt", {
    encoding: "utf-8",
});

const grid = rawInput.split('\r\n').map(row => row.split(''));

function pushRockNorthwards(map, rockY, rockX) {
    let newY = rockY;
    while (map[newY - 1]?.[rockX] === '.') newY--;
    if (newY !== rockY) {
        map[rockY][rockX] = '.';
        map[newY][rockX] = 'O';
    }
}

function pushRockWestwards(map, rockY, rockX) {
    let newX = rockX;
    while (map[rockY]?.[newX - 1] === '.') newX--;
    if (newX !== rockX) {
        map[rockY][rockX] = '.';
        map[rockY][newX] = 'O';
    }
}

function pushRockSouthwards(map, rockY, rockX) {
    let newY = rockY;
    while (map[newY + 1]?.[rockX] === '.') newY++;
    if (newY !== rockY) {
        map[rockY][rockX] = '.';
        map[newY][rockX] = 'O';
    }
}

function pushRockEastwards(map, rockY, rockX) {
    let newX = rockX;
    while (map[rockY]?.[newX + 1] === '.') newX++;
    if (newX !== rockX) {
        map[rockY][rockX] = '.';
        map[rockY][newX] = 'O';
    }
}

console.time('naive')

function cycle(grid) {
    //NORTH
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] === 'O') {
                pushRockNorthwards(grid, y, x);
            }
        }
    }
    //WEST
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] === 'O') {
                pushRockWestwards(grid, y, x);
            }
        }
    }
    //SOUTH
    for (let y = grid.length - 1; y >= 0; y--) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] === 'O') {
                pushRockSouthwards(grid, y, x);
            }
        }
    }
    //EAST
    for (let y = 0; y < grid.length; y++) {
        for (let x =  grid[0].length - 1; x >= 0; x--) {
            if (grid[y][x] === 'O') {
                pushRockEastwards(grid, y, x);
            }
        }
    }
}

//starting at cycle 93 we have a loop to 110
//so its a loop of 27 cycle

// so im guessing something like (1 000 000 000 - 92) % 27 
// so 17 cycles to go
const boardPosition = {};
let cycleStartPos;
let counter = 0;
let cycleStart;
let currBoard;
while(true) {
    cycle(grid);
    currBoard = JSON.stringify(grid);
    if (boardPosition[currBoard]) {
        cycleStart = counter;
        cycleStartPos = boardPosition[currBoard];
        break;
    } else {
        boardPosition[currBoard] = counter;
    }
    counter++;
}

//test

console.log('cycle end at', counter);
console.log('cycle start at', boardPosition[currBoard])
let loopLength = counter - boardPosition[currBoard];
console.log('loopLength', loopLength)

let temp = (1000000000 - 1 - boardPosition[currBoard]) % loopLength
console.log(temp);

currBoard = JSON.parse(currBoard);
for (let i = 0; i < temp; i++) {
    cycle(currBoard);
}


let result = 0;

for (let y = 0; y < currBoard.length; y++) {
    for (let x = 0; x < currBoard[0].length; x++) {
        if (currBoard[y][x] === 'O') {
            result += (currBoard.length - y)
        }
    }
}

console.log(result);


// this is awful code but im leaving it as is for now ahah