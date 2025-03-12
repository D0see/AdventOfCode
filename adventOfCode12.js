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
    //IF ITS NOT ALREADY VISITED AND HAS THE CORRECT VEGGIE
    if (map[y]?.[x + 1] === vege) {
        floodFill(y, x + 1, map, vege, plotStats, fencedSpots);
    //IF IT NOT ALREADY VISITED
    } else if (!fencedSpots[`${y}-${x + 1}`]) {
        plotStats.perimeter++;
    }
    if (map[y]?.[x - 1] === vege) {
        floodFill(y, x - 1, map, vege, plotStats, fencedSpots);
    } else if (!fencedSpots[`${y}-${x - 1}`]) {
        plotStats.perimeter++;
    }
    if (map[y + 1]?.[x] === vege) {
        floodFill(y + 1, x, map, vege, plotStats, fencedSpots);
    } else if (!fencedSpots[`${y + 1}-${x}`]) {
        plotStats.perimeter++;
    }
    if (map[y - 1]?.[x] === vege) {
        floodFill(y - 1, x, map, vege, plotStats, fencedSpots);
    } else if (!fencedSpots[`${y - 1}-${x}`]) {
        plotStats.perimeter++;
    }
    return plotStats;
}

/* TESTING 

const plotStats = floodFill(0, 2, map);
console.log(plotStats);
console.log(map[0]);

*/

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
