const fs = require("fs");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode6Input.txt", {
    encoding: "utf-8",
});

const parsedInput = rawInput.split('\r\n')
.map(row => row.split(':')[1].split(' ').filter(num => num).map(num => Number(num)));

const races = [];

for (let i = 0; i < parsedInput[0].length; i++) {
    races.push({
        time : parsedInput[0][i],
        distance : parsedInput[1][i]
    })
}

function getNumberOfWaysToWin(time, distance) {
    let result = 0;

    let currSpeed = 0;
    for (let i = 0; i < time; i++) {
        const timeToFinish = time - i;
        if ((distance / currSpeed) < timeToFinish) {
            result++;
        }
        currSpeed++;
    }

    return result;
}

let result = 1;

for (const race of races) {
    const { time, distance } = race;
    result *= getNumberOfWaysToWin(time, distance);
}

console.log(result);

//PART 2

const parsedInput2 = parsedInput.map(row => Number(row.join('')));

let [time, distance] = parsedInput2

let result2 = time;

let currSpeed = 0;
for (let i = 0; i < time; i++) {
    const timeToFinish = time - i;
    if ((distance / currSpeed) < timeToFinish) {
        break;
    }
    result2--;
    currSpeed++;
}

currSpeed = time;
for (let i = time; time >= 0; i--) {
    const timeToFinish = time - i;
    if ((distance / currSpeed) < timeToFinish) {
        break;
    }
    result2--;
    currSpeed--;
}

console.log(result2 + 1);