const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode10Input.txt", {
    encoding: "utf-8",
});

const map = rawInput.split("\r\n").map((row) => row.split("").map((num) => parseInt(num)));

// PART 1

const getNumberOfAccessible9s = (map, y, x, result = {}, currNum = 0) => {
    if (currNum === 9) return (result[`${y}-${x}`] = true);
    if (map[y]?.[x + 1] === currNum + 1)
        getNumberOfAccessible9s(map, y, x + 1, result, currNum + 1);
    if (map[y]?.[x - 1] === currNum + 1)
        getNumberOfAccessible9s(map, y, x - 1, result, currNum + 1);
    if (map[y + 1]?.[x] === currNum + 1)
        getNumberOfAccessible9s(map, y + 1, x, result, currNum + 1);
    if (map[y - 1]?.[x] === currNum + 1)
        getNumberOfAccessible9s(map, y - 1, x, result, currNum + 1);
    return Object.keys(result).length;
};

let result = 0;

for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
        if (!map[y][x]) result += getNumberOfAccessible9s(map, y, x);
    }
}

console.log(result);

// PART 2

const getNumberOfDifferentTrails = (
    map,
    y,
    x,
    currTrail = `${y}-${x}-`,
    result = {},
    currNum = 0
) => {
    if (currNum === 9) return (result[currTrail] = true);
    if (map[y]?.[x + 1] === currNum + 1)
        getNumberOfDifferentTrails(
            map,
            y,
            x + 1,
            currTrail + `${y}-${x + 1}-`,
            result,
            currNum + 1
        );
    if (map[y]?.[x - 1] === currNum + 1)
        getNumberOfDifferentTrails(
            map,
            y,
            x - 1,
            currTrail + `${y}-${x - 1}-`,
            result,
            currNum + 1
        );
    if (map[y + 1]?.[x] === currNum + 1)
        getNumberOfDifferentTrails(
            map,
            y + 1,
            x,
            currTrail + `${y + 1}-${x}-`,
            result,
            currNum + 1
        );
    if (map[y - 1]?.[x] === currNum + 1)
        getNumberOfDifferentTrails(
            map,
            y - 1,
            x,
            currTrail + `${y - 1}-${x}-`,
            result,
            currNum + 1
        );
    return Object.keys(result).length;
};

let result2 = 0;

for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
        if (!map[y][x]) result2 += getNumberOfDifferentTrails(map, y, x);
    }
}

console.log(result2);
