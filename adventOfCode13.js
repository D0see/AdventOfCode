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

// PART 1

/*

Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

expected result = 280;

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

expected result = Infinity

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

expectedResult = 200

*/

const test = {
    "a" : {
        "x" :  94,
        "y" :  34
    },
    "b" : {
        "x" :  22,
        "y" :  67
    },
    "prize" : {
        "x" :  8400,
        "y" :  5400
    },
}

const test2 = {
    "a" : {
        "x" :  26,
        "y" :  66
    },
    "b" : {
        "x" :  67,
        "y" :  21
    },
    "prize" : {
        "x" :  12748,
        "y" :  12176
    },
}

const test3 = {
    "a" : {
        "x" :  17,
        "y" :  86
    },
    "b" : {
        "x" :  84,
        "y" :  37
    },
    "prize" : {
        "x" :  7870,
        "y" :  6450
    },
}

const test4 = {
    "a" : {
        "x" :  2,
        "y" :  2
    },
    "b" : {
        "x" :  125,
        "y" :  125
    },
    "prize" : {
        "x" :  80,
        "y" :  80
    },
}

//a cost 3, b cost 1

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
    result += minTokensForPrize(machine);
}

console.log(result);
