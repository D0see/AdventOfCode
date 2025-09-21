const fs = require("fs");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode11Input.txt", {
    encoding: "utf-8",
});

const map = rawInput.split('\r\n').map(row => row.split(''));

for (let y = 0; y < map.length; y++) {
    if (map[y].includes('#')) continue;
    map.splice(y, 0, Array(map[0].length).fill('.'));
    y++;
}

outerLoop : for (let x = 0; x < map[0].length; x++) {
    for (let y = 0; y < map.length; y++) {
        if (map[y][x] !== '.') continue outerLoop;
    }
    for (let y = 0; y < map.length; y++) {
        map[y].splice(x, 0, '.');
    }
    x++;
}

let result = 0;

const encouteredGalaxies = [];
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
        if (map[y][x] !== '#') continue;
        for (const galaxy of encouteredGalaxies) {
            const {gY, gX} = galaxy;
            const currDist = Math.abs(y - gY) + Math.abs(x - gX);
            result += currDist;

        }
        encouteredGalaxies.push({gY : y, gX : x});
    }
}

console.log(result);

//PART 2

let result2 = 0;

const map2 = rawInput.split('\r\n').map(row => row.split(''));

const verticalVoid = {};
const horizontalVoid = {};

for (let y = 0; y < map2.length; y++) {
    if (map2[y].includes('#')) continue;
    horizontalVoid[y] = true;
}

outerLoop : for (let x = 0; x < map2[0].length; x++) {
    for (let y = 0; y < map2.length; y++) {
        if (map2[y][x] !== '.') continue outerLoop;
    }
    verticalVoid[x] = true;
}

function calculateDistance(a, b, voids) {
    let result = 0;
    if (a > b) return calculateDistance(b, a, voids);
    for (a; a < b; a++) {
        result += voids[a] ? 1_000_000 : 1
    }
    return result;
}

const encouteredGalaxies2 = [];
for (let y = 0; y < map2.length; y++) {
    for (let x = 0; x < map2[0].length; x++) {
        if (map2[y][x] !== '#') continue;
        for (const galaxy of encouteredGalaxies2) {
            const {gY, gX} = galaxy;
            const currDist = calculateDistance(y, gY, horizontalVoid) + calculateDistance(x, gX, verticalVoid);
            result2 += currDist;
        }
        encouteredGalaxies2.push({gY : y, gX : x});
    }
}

console.log(result2);