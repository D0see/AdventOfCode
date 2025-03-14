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

const tilesWide = 101;
const tilesTall = 103;

//PART 1


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
        robot.y === Math.floor(tilesTall / 2)) continue;

    if (robot.x < Math.floor(tilesWide / 2)) {
        robot.y < Math.floor(tilesTall / 2) ? quadrants[0]++ : quadrants[1]++;
        continue;
    } 
    robot.y < Math.floor(tilesTall / 2) ? quadrants[2]++ : quadrants[3]++;
    
}
console.log(quadrants.reduce((acc, val) => acc *= val, 1));

//PART 2 ATTEMPT AT VISUALIZATION (nope)
const matrix = [];
for (let y = 0; y < tilesTall; y++) {
    const currRow = [];
    for (let x = 0; x < tilesWide; x++) {
        currRow.push(0);
    }
    matrix.push(currRow);
}



//initializes matrix
for (const robot of robots) {
    matrix[robot.position.y][robot.position.x] += 1;
}

//animationLoop
const hasTrunk = (matrix) => {
    for (let i = 0; i < 25; i++) {
        if (matrix[102 - i][50]) continue;
        return false;
    }
    return true;
}

while(true) {
    for (const robot of robots) {
        matrix[robot.position.y][robot.position.x] -= 1;
        matrix
        [(((robot.position.y + (robot.velocity.y *100 )) % tilesTall) + tilesTall) % tilesTall]
        [(((robot.position.x + (robot.velocity.x)) % tilesWide) + tilesWide) % tilesWide] += 1;
    }
    if (hasTrunk(matrix)) {
        console.log("trunk alert");
        break;
    }
}
