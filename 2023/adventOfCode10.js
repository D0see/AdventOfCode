const fs = require("fs");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode10Input.txt", {
    encoding: "utf-8",
});

const map = rawInput.split('\r\n').map(row => row.split(''));

const connectDirections = {
    north : ['|', 'F','7','S'],
    west : ['-', 'L','F','S'],
    south : ['|', 'J','L','S'],
    east : ['7','J', '-','S']
}

const connectsTo = {
    south : ['|', 'F','7','S'],
    east : ['-', 'L','F','S'],
    north : ['|', 'J','L','S'],
    west : ['7','J', '-','S']
}

function getPosShift(direction) {
    switch(direction) {
        case 'north':
            return {
                shiftY : -1,
                shiftX : 0,
            }
        case 'south':
            return {
                shiftY : 1,
                shiftX : 0,
            }
        case 'east':
            return {
                shiftY : 0,
                shiftX : 1,
            }
        case 'west':
            return {
                shiftY : 0,
                shiftX : -1,
            }
    }
}

function findStartingPos(map) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x] === 'S') return {
                startingY : y, startingX : x
            }
        }
    }
}
    
function traversePipe(map, startingY, startingX, visited, counter = 1) {
    visited[`${startingY}-${startingX}`] = counter;
    counter++;
    const startingSymbol = map[startingY][startingX];

    const possibleNextPipes = [
        {y : startingY - 1, x : startingX, direction: 'north'}, 
        {y : startingY + 1, x : startingX, direction : 'south'},
        {y : startingY, x : startingX - 1, direction : 'west'},
        {y : startingY, x : startingX + 1, direction : 'east'}
    ] 
    for (const {y, x, direction} of possibleNextPipes) {
        if (!map[y]?.[x] || visited[`${y}-${x}`]) continue;
        const currSymbol = map[y][x];
        if (!connectDirections[direction].includes(currSymbol)) continue;
        if (!connectsTo[direction].includes(startingSymbol)) continue;

        const { shiftY, shiftX } = getPosShift(direction);
        return traversePipe(map, startingY + shiftY, startingX + shiftX, visited, counter)
    };
}

const {startingY, startingX } = findStartingPos(map);;

const visited = {};
traversePipe(map, startingY, startingX, visited);
console.log(Math.max(...Object.values(visited))/2)


// node --stack-size=16384 adventOfCode10.js 
// since we dont have TCO in node