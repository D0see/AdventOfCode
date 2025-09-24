const fs = require("fs");
const v8 = require('v8');
v8.setFlagsFromString('--stack-size=8000');

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode17Input.txt", {
    encoding: "utf-8",
});

const grid = rawInput.split('\r\n').map(row => row.split('').map(num => Number(num)));

// this is really bad but leverage the random nature of the input
let naiveMinHeat = grid[0].reduce((acc, val) => acc + val, 0);
for (let y = 1; y < grid.length; y++) {
    naiveMinHeat += grid[y][grid[0].length - 1]
}

const minHeat = [naiveMinHeat * 1.5];
//used for part2
const minHeat2 = [naiveMinHeat * 1.5];

visitedSquares = {}
function traverseGrid(grid, currY = 0, currX = 0, currDirection = [null, 0], cumulatedHeat = 0) {
    if (cumulatedHeat >= minHeat[0]) return;

    if (currY === grid.length - 1 && currX === grid[0].length - 1) {
        minHeat[0] = cumulatedHeat < minHeat[0] ? cumulatedHeat : minHeat[0];
        return;
    }

    //visitedSquares could take into account position and direction + number of step in that direction.
    const currSquareData = visitedSquares[`${currY}-${currX}-${currDirection[0]}-${currDirection[1]}`];
    if (currSquareData !== undefined && currSquareData <= cumulatedHeat) {
        return;
    } else {
        visitedSquares[`${currY}-${currX}-${currDirection[0]}-${currDirection[1]}`] = cumulatedHeat;
    }

        // if next position exists
    if (grid[currY - 1]?.[currX] 
        // the crucible cant go backwards
        && currDirection[0] !== 'down'
        // currDirection isnt both this one and hasnt been taken 3 times in a row
        && !(currDirection[0] === 'up' && currDirection[1] === 3)) {
            const newDir = ['up', currDirection[0] === 'up' ? currDirection[1] + 1 : 1];
            traverseGrid(grid, currY - 1, currX, newDir, cumulatedHeat + grid[currY - 1][currX]);
    } 

    if (grid[currY + 1]?.[currX] 
        && currDirection[0] !== 'up'
        && !(currDirection[0] === 'down' && currDirection[1] === 3)) {
            const newDir = ['down', currDirection[0] === 'down' ? currDirection[1] + 1 : 1];
            traverseGrid(grid, currY + 1, currX, newDir, cumulatedHeat + grid[currY + 1][currX]);
    }

    if (grid[currY]?.[currX - 1] 
        && currDirection[0] !== 'right'
        && !(currDirection[0] === 'left' && currDirection[1] === 3)) {
            const newDir = ['left', currDirection[0] === 'left' ? currDirection[1] + 1 : 1];
            traverseGrid(grid, currY, currX - 1, newDir, cumulatedHeat + grid[currY][currX - 1]);
    }

    if (grid[currY]?.[currX + 1] 
        && currDirection[0] !== 'left'
        && !(currDirection[0] === 'right' && currDirection[1] === 3)) {
            const newDir = ['right', currDirection[0] === 'right' ? currDirection[1] + 1 : 1];
            traverseGrid(grid, currY, currX + 1, newDir, cumulatedHeat + grid[currY][currX + 1]);
    }   
}

traverseGrid(grid);

console.log(minHeat[0]);

// PART 2