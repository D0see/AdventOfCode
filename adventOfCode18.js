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

// recursive DFS function to find the shortest path
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
        findShortestPath(coordinates, y, x, currPathLength + 1, destinationY, destinationX, shortestPath);
    })
    
    return shortestPath[0];
}

console.log(findShortestPath(coordinates, 0,0,0,70,70));

// PART 2

// corrupted coordinates after 1024th
const allCorruptedCoordinates = coordinatesArrays.slice(1024);

for (let i = 0; i < allCorruptedCoordinates.length; i++) {

    // TO-FIX THIS IS HORRIBLE !!!
    const coordinates2 = coordinatesArrays.slice(0, 1025 + i).reduce((obj, coord) => {
        obj[coord[1]] ? obj[coord[1]][coord[0]] = -Infinity : obj[coord[1]] = {[coord[0]] : -Infinity};
        return obj;
    }, {})
    if (findShortestPath(coordinates2, 0,0,0,70,70)) continue;
    console.log(allCorruptedCoordinates[i])
    break;
}