const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode18Input.txt", {
  encoding: "utf-8",
});

// x, y coords
const splittedByLines = rawInput.split("\r\n");
const coordinatesArrays = splittedByLines.map(line => line.split(','));


// PART 1

// coordinate obj -> {...y: {...x}}
const coordinates = coordinatesArrays.slice(0, 1024).reduce((obj, coord) => {
    // corrupted coordinates are initialized at -Infinity
    obj[coord[1]] ? obj[coord[1]][coord[0]] = -Infinity : obj[coord[1]] = {[coord[0]] : -Infinity};
    return obj;
}, {})

// recursive function to find the shortest path
const findShortestPath = (coordinates, y, x, currPathLength, destinationY, destinationX, shortestPath = [0]) => {
    coordinates[y] ? coordinates[y][x] = currPathLength : coordinates[y] = {[x] : currPathLength};

    if (x === destinationX && y === destinationY) 
        return shortestPath[0] = shortestPath[0] < currPathLength && shortestPath[0] ? shortestPath[0] : currPathLength;

    [
        [y + 1, x],
        [y, x + 1],
        [y - 1, x],
        [y, x - 1],
    ].forEach(([y, x]) => {
        if (y < 0 || y > destinationY || x < 0 || x > destinationX || (coordinates[y]?.[x] <= (currPathLength + 1))) return;
        findShortestPath(shortestPath, coordinates, y, x, currPathLength + 1, destinationY, destinationX, shortestPath);
    })
    
    return shortestPath[0]
}

console.log(findShortestPath(coordinates, 0, 0, 0, 70, 70));