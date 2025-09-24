const fs = require("fs");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode18Input.txt", {
    encoding: "utf-8",
});

//used to get the grid size
let minGridHeight = 0;
let maxGridHeight = 0;
let minGridWidth = 0;
let maxGridWidth = 0;

let currGridHeight = 1;
let currGridWidth = 1;

const parsedInput = rawInput.split('\r\n').map(row => {
    const currRow = row.split(' ');
    const order =  {
                direction : currRow[0],
                length : Number(currRow[1]),
                code : currRow[2]
            }
    if (order.direction === 'R') {
        currGridWidth += order.length;
        maxGridWidth = Math.max(maxGridWidth, currGridWidth);
    } else if (order.direction === 'L') {
        currGridWidth -= order.length;
        minGridWidth = Math.min(minGridWidth, currGridWidth);
    } else if (order.direction === 'D') {
        currGridHeight += order.length;
        maxGridHeight = Math.max(maxGridHeight, currGridHeight);
    } else if (order.direction === 'U') {
        currGridHeight -= order.length;
        minGridHeight = Math.min(minGridHeight, currGridHeight);
    }
    return order;
})

const grid = Array(Math.abs(minGridHeight) + Math.abs(maxGridHeight) + 1).fill(null)
            .map(_ => Array(Math.abs(minGridWidth) + Math.abs(maxGridWidth) + 1).fill('.'));

const worker = {
    wY : Math.abs(minGridHeight) + 1,
    wX : Math.abs(minGridWidth) + 1
}

for (const { direction, length, _ } of parsedInput) {
    const {wY, wX} = worker;
    if (direction === 'L') {
        for (let x = 0; x < length + 1; x++) {
           grid[wY][wX - x] = '#';
        }
        worker.wX -= length;
    } else if (direction === 'R') {
        for (let x = 0; x < length + 1; x++) {
           grid[wY][wX + x] = '#';
        }
        worker.wX += length;
    } else if (direction === 'U') {
        for (let y = 0; y < length + 1; y++) {
           grid[wY - y][wX] = '#';
        }
        worker.wY -= length;
    } else if (direction === 'D') {
        for (let y = 0; y < length + 1; y++) {
           grid[wY + y][wX] = '#';
        }
        worker.wY += length;
    }
}

function floodFill(grid, y, x) {
    grid[y][x] = '#';
    [
        [1, 0],[-1, 0],[0, 1],[0, -1]
    ].forEach(newCoord => {
        const [offsetY, offsetX] = newCoord;
        if (!grid[y + offsetY]?.[x + offsetX]) return;
        if (grid[y + offsetY][x + offsetX] === '.') {
            floodFill(grid, y + offsetY, x + offsetX);
        }
    })
}


const floodFillStartY = Math.floor(grid.length / 2);
const floodFillStartX = grid[floodFillStartY].findIndex(char => char === '#') + 1
floodFill(grid, floodFillStartY, floodFillStartX);

//fs.writeFileSync('viz.txt', grid.join('\r\n'));

const result = grid.reduce((acc, row) => {
    acc += row.reduce((acc, char) => {
        acc += char === '#' ? 1 : 0;
        return acc;
    }, 0)
    return acc;
}, 0)

console.log(result);


//NAIVE IMPLEMENTATION

//PART 2

//i could do something where i track every the start and end position of every hollowing order
//maybe i could calc the area of the hollowed hole with the ranges if they were sorted