const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode12Input.txt", {
    encoding: "utf-8",
});

const map = rawInput.split("\r\n").map((row) => row.split(""));

// PART 1

const floodFill = (y, x, map, vege = map[y][x], plotStats = {area : 0, perimeter : 0}, fencedSpots = {}) => {
    //MARKS STOP AS VISITED
    map[y][x] = null;
    //ADDS IT THE FENCED STOP MAP
    fencedSpots[`${y}-${x}`] = true;
    plotStats.area++;
    [[y, x + 1], [y, x - 1], [y + 1, x], [y - 1, x]].forEach(([movY, movX]) => {
        //IF ITS NOT ALREADY VISITED AND HAS THE CORRECT VEGGIE
        if (map[movY]?.[movX] === vege) {
            floodFill(movY, movX, map, vege, plotStats, fencedSpots);
        //IF ITS NOT PART OF THIS SPOT
        } else if (!fencedSpots[`${movY}-${movX}`]) {
            plotStats.perimeter++;
        }
    })
    return plotStats;
}

let result = 0;

for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
        if (map[y][x]) {
            // plotStats = {area : int, perimeter : int}
            const plotStats = floodFill(y, x, map);
            result += plotStats.area * plotStats.perimeter;
        } 
    }
}

console.log(result);
