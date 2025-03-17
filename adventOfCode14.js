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


//PART 2 ATTEMPT AT FINDING THE TREE ! NEXT : try floodfill for around 15 robots next to eachother


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



const tree ="oooxooo.ooxxxoo.oxxxxxo.xxxxxxx".split(".").map(row => row.split('').map(cell => cell === 'x' ? true : false));
const checkForTree = (matrix, currY, currX, tree) => {
    for (let y = 0; y < tree.length; y++) {
        for (let x = 0; x < tree[0].length; x++) {
            if (tree[y][x] && !matrix[currY + y][currX + x]) {return false;}
        }
    }
    return true;
}

const hasTree = (matrix, tree) => {
    for (let y = 0; y < matrix.length - (tree.length - 1); y++) {
        for (let x = 0; x < matrix[0].length - (tree[0].length - 1); x++) {
            if(checkForTree(matrix, y, x, tree)) return true;
        }
    }
    return false;
}

/* test
const matrix = [
    [0,0,0,0,1,0,0,0,0],
    [0,0,0,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,0],
]


if (hasTree(matrix, tree)) {
    console.log("tree alert");
}

*/


while(true) {
    console.count("iteCount")
    for (const robot of robots) {
        matrix[robot.position.y][robot.position.x] -= 1;
        matrix
        [(((robot.position.y + (robot.velocity.y *100 )) % tilesTall) + tilesTall) % tilesTall]
        [(((robot.position.x + (robot.velocity.x)) % tilesWide) + tilesWide) % tilesWide] += 1;
    }
    if (hasTree(matrix, tree)) {
        console.log("tree alert");
        break;
    }
}
    