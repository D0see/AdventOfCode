const fs = require("fs");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode12Input.txt", {
    encoding: "utf-8",
});

const parsedInput = rawInput.split('\r\n').map(row => {
    const currRow = row.split(' ');
    currRow[0] = currRow[0].split('');
    currRow[1] = currRow[1].split(',');
    return {
        pattern : currRow[0],
        sequence : currRow[1]
    }
});

function getPatternSequence(sequence) {
    const seqPattern = [];
    let currBlock = ''
    for (const symbol of sequence) {
        if (!(symbol === '#')) {
            if (currBlock) seqPattern.push(currBlock.length);
            currBlock = '';
        } else {
            currBlock += '#';
        }
    }
    if (currBlock) seqPattern.push(currBlock.length);
    return seqPattern.join('-');
}

function patternCorrespondsToSequence(pattern, sequence) {
    return getPatternSequence(pattern) === sequence.join('-');
}

function getPossibleSequences(pattern, sequence, lastQMIndex, patternIndex = 0, numOfSequences = [0]) {
    if (patternIndex > lastQMIndex && patternCorrespondsToSequence(pattern, sequence)) {
        return numOfSequences[0]++;
    }
    for (let i = patternIndex; i < pattern.length; i++) {
        if (pattern[i] === '?') {
            getPossibleSequences(pattern.toSpliced(i, 1, '#'), sequence, lastQMIndex, i + 1, numOfSequences);
            getPossibleSequences(pattern.toSpliced(i, 1, '.'), sequence, lastQMIndex, i + 1, numOfSequences);
            break;
        }
    }
    return numOfSequences[0];
}

let result = 0;

for (const obj of parsedInput) {
    const { pattern, sequence } = obj;
    const lastQMIndex = pattern.findLastIndex(char => char === '?');
    let curr = getPossibleSequences(pattern, sequence, lastQMIndex);
    result += curr;
}

console.log(result);

//PART 2

const parsedInput2 = rawInput.split('\r\n').map(row => {
    const currRow = row.split(' ');
    currRow[0] = currRow[0].split('');
    currRow[1] = currRow[1].split(',');
    const pattern = currRow[0]; // time 5
    const sequence = currRow[1]; // times 5
    
});