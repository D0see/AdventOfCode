const fs = require("fs");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode2Input.txt", {
    encoding: "utf-8",
});

const games = rawInput.split('\r\n').map(row => {
    let data = row.split(':')

    data[0] = data[0].split(' ')[1];

    data[1] = data[1].split(';').reduce((maxNumOfCubesPerColor, game) => {

        const gameData = game.split(',').map(data => data.split(' ').slice(1));

        gameData.forEach(([numberOfCubes, color]) => {
            maxNumOfCubesPerColor[color] = 
            maxNumOfCubesPerColor[color] ? 
            Math.max(maxNumOfCubesPerColor[color], numberOfCubes) : 
            numberOfCubes;
        }) 

        return maxNumOfCubesPerColor;
    }, {});

    return {
        number : Number(data[0]),
        highestNumPerColor : data[1]
    };
});

// only 12 red cubes, 13 green cubes, and 14 blue cubes.
const maxCubesPerColor = {
    red : 12,
    green : 13,
    blue : 14,
}

let result = 0;

gameLoop :for (const game of games) {
    const {number, highestNumPerColor} = game;
    for (const color of Object.keys(maxCubesPerColor)) {
        if (highestNumPerColor[color] > maxCubesPerColor[color]) continue gameLoop;
    }
    result += number;
}

console.log(result);