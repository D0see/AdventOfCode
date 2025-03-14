const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode14Input.txt", {
    encoding: "utf-8",
});

const splittedByLines = rawInput.split("\r\n").map(line => line.split(" "));

const robots = [];
for (const infos of splittedByLines) {
    const pos = infos[0].slice(2).split(",").map(num => parseInt(num));
    const vel = infos[1].slice(2).split(",").map(num => parseInt(num));
    robots.push({
        position : {
            'x' : pos[0],
            'y' : pos[1]
        },
        velocity : {
            'x' : vel[0],
            'y' : vel[1]
        }
    })
}


//PART 1
const tilesWide = 101;
const tilesTall = 103;

const robotsPositionsAfter100s = [];

for (const robot of robots) {
    robotsPositionsAfter100s.push({
        'x' : (((robot.position.x + (robot.velocity.x *100 )) % tilesWide) + tilesWide) % tilesWide,
        'y' : (((robot.position.y + (robot.velocity.y *100 )) % tilesTall) + tilesTall) % tilesTall
    })
}

let quadrants = [0,0,0,0]

for (const robot of robotsPositionsAfter100s) {
    if (robot.x === Math.floor(tilesWide / 2) ||
        robot.y === Math.floor(tilesTall / 2)) {
            continue;
        }
    if (robot.x < Math.floor(tilesWide / 2)) {
        if (robot.y < Math.floor(tilesTall / 2)) {
            quadrants[0]++;
        } else {
            quadrants[1]++;
        }
    } else if (robot.x > Math.floor(tilesWide / 2)) {
        if (robot.y < Math.floor(tilesTall / 2)) {
            quadrants[2]++;
        } else {
            quadrants[3]++;
        }
    }
}

console.log(quadrants.reduce((acc, val) => {
    acc *= val;
    return acc;
} , 1));
