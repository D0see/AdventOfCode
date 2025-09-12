const fs = require("fs");
const { parse } = require("path");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode4Input.txt", {
    encoding: "utf-8",
});

const parsedCards = rawInput.split('\r\n').map(line => {
    line = line.split(':');
    line[0] = line[0].split(' ').filter(char => char)[1];
    line[1] = line[1].split('|');
    line[1][0] = line[1][0].split(' ').filter(num => num).reduce((acc, val) => {
        acc[val] = true;
        return acc;
    }, {})

    return {
        number : line[0],
        winningNumbersMap : line[1][0],
        playerNumbers : line[1][1].split(' ').filter(num => num),
        winningNumbersCount : 0,
        possessed : 1,
    }

})

let result = 0;

for (const parsedCard of parsedCards) {
    const {_, winningNumbersMap, playerNumbers} = parsedCard;
    let currScore = 0;
    for (const number of playerNumbers) {
        if (winningNumbersMap[number]) {
            currScore = !currScore ? 1 : currScore * 2;
            //used for part 2
            parsedCard.winningNumbersCount++;
        }
    }
    result += currScore;
}

console.log(result);

// PART 2

let result2 = 0;

for (let i = 0; i < parsedCards.length; i++) {
    for (let j = i + 1; j <= (i + parsedCards[i].winningNumbersCount); j++) {
        parsedCards[j].possessed += parsedCards[i].possessed;
    }
    result2 += parsedCards[i].possessed
}

console.log(result2)
