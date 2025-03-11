const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode11Input.txt", {
    encoding: "utf-8",
});

const stones = rawInput.split(" ").map((num) => parseInt(num));

// PART 1

/* TEST
const stones = "0 1 10 99 999".split(" ").map((num) => parseInt(num));
*/

const updateStones = (stones) => {
    for (let i = 0; i < stones.length; i++) {
        if (stones[i] === 0) {
            stones[i] = 1;
        } else if (`${stones[i]}`.length % 2 === 0) {
            const left = `${stones[i]}`.slice(0, `${stones[i]}`.length / 2);
            const right = `${stones[i]}`.slice(`${stones[i]}`.length / 2);
            stones.splice(i, 1, parseInt(left), parseInt(right));
            i++;
        } else {
            stones[i] *= 2024;
        }
    }
    return stones;
};

for (let i = 0; i < 25; i++) {
    updateStones(stones);
}

console.log(stones.length);
