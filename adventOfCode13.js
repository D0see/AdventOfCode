const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode13Input.txt", {
    encoding: "utf-8",
});

const splittedByLines = rawInput.split("\r\n").filter(line => line);

const machines = [];
for (let i = 0; i < splittedByLines.length; i+=3) {
    machines.push({
        "a" : {
            "x" :  parseInt(splittedByLines[i].slice(splittedByLines[i].indexOf('X') + 1, splittedByLines[i].indexOf(','))),
            "y" :  parseInt(splittedByLines[i].slice(splittedByLines[i].indexOf('Y') + 1))
        },
        "b" : {
            "x" :  parseInt(splittedByLines[i + 1].slice(splittedByLines[i + 1].indexOf('X') + 1, splittedByLines[i + 1].indexOf(','))),
            "y" :  parseInt(splittedByLines[i + 1].slice(splittedByLines[i + 1].indexOf('Y') + 1))
        },
        "prize" : {
            "x" :  parseInt(splittedByLines[i + 2].slice(splittedByLines[i + 2].indexOf('X') + 2, splittedByLines[i + 2].indexOf(','))),
            "y" :  parseInt(splittedByLines[i + 2].slice(splittedByLines[i + 2].indexOf('Y') + 2)) 
        },
    });
}

const minTokensForPrize = ({a, b, prize}) => {
    let finalResult = Infinity;
    let result = 0;
    let currY = 0;
    let currX = 0;
    let [bButtonXRatio, bButtonYRatio] = [((prize.x - currX) / b.x), ((prize.y - currY) / b.y)];
    while (currX < prize.x && currY < prize.y) {
        if (bButtonXRatio === bButtonYRatio && Number.isInteger(bButtonXRatio)) {
            finalResult = (result + bButtonYRatio) < finalResult ? (result + bButtonYRatio) : finalResult;
        }
        currY += a.y;
        currX += a.x;
        result+= 3;
        [bButtonXRatio, bButtonYRatio] = [((prize.x - currX) / b.x), ((prize.y - currY) / b.y)]
    }
    if (finalResult === Infinity) {
        if (currX === prize.x && currY === prize.y) finalResult = result;
    }
    return finalResult === Infinity ? 0 : finalResult;
}

let result = 0;

for (const machine of machines) {
    console.count("machine")
    result += minTokensForPrize(machine);
}

console.log(result);

// PART 2 -> prize.x += 10000000000000, prize.y += 10000000000000 for each machines 