const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode11Input.txt", {
    encoding: "utf-8",
});

const stones = rawInput.split(" ");

// PART 1

/* TEST
const stones = "0 1 10 99 999".split(" ").map((num) => parseInt(num));
const stones = ["0"];
*/

const updateStones = (stones) => {
    for (let i = 0; i < stones.length; i++) {
        if (stones[i] === "0") {
            stones[i] = "1";
        } else if (stones[i].length % 2 === 0) {
            const left = stones[i].slice(0, `${stones[i]}`.length / 2);
            const right = `${parseInt(stones[i].slice(`${stones[i]}`.length / 2))}`;
            stones.splice(i, 1, left, right);
            i++;
        } else {
            stones[i] = `${parseInt(stones[i]) * 2024}`;
        }
    }
    return stones;
};

const blink = (stones, num) => {
    for (let i = 0; i < num; i++) {
        updateStones(stones);
    }
    return stones;
};

blink(stones, 25);
console.log("endOfPart1");

// PART 2

const stats = {};
for (let i = 0; i < stones.length; i++) {
    stats[stones[i]] ? stats[stones[i]]++ : (stats[stones[i]] = 1);
}

console.log(stats);

//HERE WE SAVE THE STONE DISPOSITION AFTER 25 MORE BLINKS FOR EVERY STONE NUMBER
//{"1" = [...stones after 25 blinks as string]}

/*
const preCompStonesFromStone = {};
for (const key of Object.keys(stats)) {
    console.count("preComp");
    preCompStonesFromStone[key] = blink([key], 25);
}
fs.writeFileSync("./adventOfCode11_25BlinksStones.json", JSON.stringify(preCompStonesFromStone));
*/

const preComputedStones = JSON.parse(fs.readFileSync("./adventOfCode11_25BlinksStones.json"));

const numOfStonesCreatedAfter25Blinks = {};
for (const key of Object.keys(preComputedStones)) {
    numOfStonesCreatedAfter25Blinks[key] = preComputedStones[key].length;
}
console.log("1");
for (const stones of Object.values(preComputedStones)) {
    for (const stone of stones) {
        if (!numOfStonesCreatedAfter25Blinks[stone]) {
            console.count("preComp");
            preComputedStones[stone] = blink([stone], 25);
            numOfStonesCreatedAfter25Blinks[stone] = preComputedStones[stone].length;
        }
    }
}
console.log("2");
for (const key of Object.keys(preComputedStones)) {
    preComputedStones[key] = preComputedStones[key].reduce(
        (acc, stone) => acc + numOfStonesCreatedAfter25Blinks[stone],
        0
    );
}

console.log("starting to add");

let result = 0;

for (const stone of stones) {
    result += preComputedStones[stone];
}

console.log(result);
