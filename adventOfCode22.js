const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode22Input.txt", {
    encoding: "utf-8",
});

const numbers = rawInput.split('\r\n');

const pruneVal = BigInt(16777216);

const generateNextNum = (number) => {
    number = BigInt(number);
    let temp = number * BigInt(64);
    number = number ^ temp;
    
    number %= pruneVal;

    temp = number / BigInt(32);
    number = number ^ temp;
    number %= pruneVal;

    temp = number * BigInt(2048);
    number = number ^ temp;
    number %= pruneVal;

    return number;
}

let result = BigInt(0);

for(let i = 0; i < numbers.length; i++) {
    let currNum = numbers[i];
    for (let j = 0; j < 2000; j++) {
        currNum = generateNextNum(currNum); 
    }
    result += currNum;
}

console.log(result);