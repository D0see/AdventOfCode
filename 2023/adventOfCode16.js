const fs = require("fs");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode16Input.txt", {
    encoding: "utf-8",
});

const grid = rawInput.split('\r\n').map(row => row.split(''));

const directions = {
    up : {
        dir : 'up',
        velY : -1,
        velX : 0
    },
    down : {
        dir : 'down',
        velY : 1,
        velX : 0
    },
    left : {
        dir : 'left',
        velY : 0,
        velX : -1
    },
    right : {
        dir : 'right',
        velY : 0,
        velX : 1
    }
}

const photons = [
    {
        direction : directions.right,
        currY : 0,
        currX : -1
    }
];

const illuminatedSquares = {};

// function illuminateGrid(grid, startingPhoton) {
//     const illuminatedSquares = {};

// }

while (true) {
    for (const [index, photon] of photons.entries()) {
        const { direction, currY, currX } = photon;
        const { velY, velX } = direction;

        if (illuminatedSquares[`${currY}-${currX}`]) {
            //exit condition
            if (illuminatedSquares[`${currY}-${currX}`][direction.dir]) {
                photons.splice(index, 1);
                break;
            } else {
                illuminatedSquares[`${currY}-${currX}`][direction.dir] = true;
            }
        } else {
            illuminatedSquares[`${currY}-${currX}`] = {[direction.dir] : true};
        }

        //updates position
        photon.currY = currY + velY;
        photon.currX = currX + velX;

        const nextSquare = grid[currY + velY]?.[currX + velX];
        if (!nextSquare) {
            photons.splice(index, 1);
        // handles special cases : redirection and cloning
        } else if (nextSquare === '/') {
            if (photon.direction.dir === 'up') {
                photon.direction = directions.right;
            } else if (photon.direction.dir === 'down') {
                photon.direction = directions.left;
            } else if (photon.direction.dir === 'left') {
                photon.direction = directions.down;
            } else {
                photon.direction = directions.up;
            }

        } else if (nextSquare === '\\') {
            if (photon.direction.dir === 'up') {
                photon.direction = directions.left;
            } else if (photon.direction.dir === 'down') {
                photon.direction = directions.right;
            } else if (photon.direction.dir === 'left') {
                photon.direction = directions.up;
            } else {
                photon.direction = directions.down;
            }

        } else if (nextSquare === '|') {
            if (['left', 'right'].includes(photon.direction.dir)) {
                const upPhoton = structuredClone(photon);
                upPhoton.direction = directions.up;
                const downPhoton = structuredClone(photon);
                downPhoton.direction = directions.down;
                photons.splice(index, 1, upPhoton, downPhoton);
            }
        } else if (nextSquare === '-') {
            if (['up', 'down'].includes(photon.direction.dir)) {
                const leftPhoton = structuredClone(photon);
                leftPhoton.direction = directions.left;
                const rightPhoton = structuredClone(photon);
                rightPhoton.direction = directions.right;
                photons.splice(index, 1, leftPhoton, rightPhoton);
            } 
        }
    }
    if (!photons.length) break;
}

let result = Object.keys(illuminatedSquares).length - 1;

console.log(result);