const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode11Input.txt", {
  encoding: "utf-8",
});

const stones = rawInput.split(" ");

// PART 1

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

const stonesAfter25blinks = blink(stones, 25);
console.log(stonesAfter25blinks.length);

// PART 2

const numOfStonesWithVal = {};
for (let i = 0; i < stones.length; i++) {
  numOfStonesWithVal[stones[i]]
    ? numOfStonesWithVal[stones[i]]++
    : (numOfStonesWithVal[stones[i]] = 1);
}

//HERE WE SAVE THE STONE DISPOSITION AFTER 25 MORE BLINKS FOR EVERY STONE NUMBER
const preCompStonesFromStone = {};
for (const key of Object.keys(numOfStonesWithVal)) {
  preCompStonesFromStone[key] = blink([key], 25);
}

//HERE WE SAVE THE NUMBER OF STONES CREATED AFTER 25 BLINKS FOR EVERY DIFFERENT STONES-KEY IN preCompStonesFromStone
const numOfStonesCreatedAfter25Blinks = {};
for (const key of Object.keys(preCompStonesFromStone)) {
  numOfStonesCreatedAfter25Blinks[key] = preCompStonesFromStone[key].length;
}

//HERE WE DO THE SAME FOR THE STONES-VALUES IN preCompStonesFromStone, SKIPPING THE ONE WE ALREADY COMPUTED
for (const stones of Object.values(preCompStonesFromStone)) {
  for (const stone of stones) {
    if (!numOfStonesCreatedAfter25Blinks[stone]) {
      preCompStonesFromStone[stone] = blink([stone], 25);
      numOfStonesCreatedAfter25Blinks[stone] =
        preCompStonesFromStone[stone].length;
    }
  }
}

//HERE WE JUST ADD THE STONES-VALUES IN preCompStonesFromStone (USING THEM AS KEYS FOR numOfStonesCreatedAfter25Blinks) SO IT ADDS UP TO 75 BLINKS
for (const key of Object.keys(preCompStonesFromStone)) {
  preCompStonesFromStone[key] = preCompStonesFromStone[key].reduce(
    (acc, stone) => acc + numOfStonesCreatedAfter25Blinks[stone],
    0
  );
}

let result = 0;

for (const stone of stones) {
  result += preCompStonesFromStone[stone];
}

console.log(result);

//THIS IS BY FAR MY WORST SOLUTION IM SORRY IF YOU TRIED TO UNDERSTAND THIS :(
