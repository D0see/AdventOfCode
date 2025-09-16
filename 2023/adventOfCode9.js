const fs = require("fs");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode9Input.txt", {
    encoding: "utf-8",
});

const lines = rawInput.split('\r\n').map(row => row.split(' ').map(num => Number(num)));
const grids = [];

for (const line of lines) {
    const currGrid = [line]
    let currLine = line;
    while (currLine.filter(num => num !== 0).length !== 0) {
        const newLine = [];
        for (let i = 1; i < currLine.length; i++) {
            newLine.push(currLine[i] - currLine[i - 1]);
        }
        currGrid.unshift(newLine);
        currLine = newLine;
    }
    grids.push(currGrid);
}

for (const twoDArr of grids) {
    for (let i = 0; i < twoDArr.length; i++) {
        const currVal = (twoDArr[i - 1]?.[twoDArr[i - 1]?.length - 1] || 0) + (twoDArr[i]?.[twoDArr[i]?.length - 1] || 0);
        twoDArr[i].push(
            currVal
        )
    }
}

const result = grids.reduce((acc, grid) => {
    acc += grid[grid.length - 1][grid[grid.length - 1].length - 1];
    return acc;
}, 0)

console.log(result);


