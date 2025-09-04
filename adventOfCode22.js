const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode22Input.txt", {
    encoding: "utf-8",
});

const numbers = rawInput.split('\r\n');


//PART 1

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

//PART 2 

const sequencesVal = {};

for(let i = 0; i < numbers.length; i++) {
    let currNum = numbers[i];
    const lastDigits = [`${currNum}`[`${currNum}`.length - 1]];
    const currBuyerSequenceVal = {};

    for (let j = 0; j < 2000; j++) {
        currNum = generateNextNum(currNum); 
        lastDigits.push(`${currNum}`[`${currNum}`.length - 1])
    }

    for (let i = 4; i < lastDigits.length; i++) {
        let firstVal = lastDigits[i - 3] - lastDigits[i - 4];
        let secondVal = lastDigits[i - 2] - lastDigits[i - 3];
        let thirdVal = lastDigits[i - 1] - lastDigits[i - 2];
        let fourthVal = lastDigits[i] - lastDigits[i - 1];

        const sequence = `${firstVal}/${secondVal}/${thirdVal}/${fourthVal}`
        currBuyerSequenceVal[sequence] ? '' : currBuyerSequenceVal[sequence] = Number(lastDigits[i]);
    }

    for (const key of Object.keys(currBuyerSequenceVal)) {
        sequencesVal[key] ? sequencesVal[key] += currBuyerSequenceVal[key] : sequencesVal[key] = currBuyerSequenceVal[key]
    }
    
}

console.log(Object.values(sequencesVal).reduce((acc, val) => val > acc ? val : acc,0));

