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

function patternSequenceToBaseSequence(patternSequence, sequence) {
    return patternSequence.slice(0, -1) === sequence;
}

function getPossibleSequences(pattern, sequence, lastQMIndex, patternSequence = '', currBlockLength = 0, patternIndex = 0, numOfSequences = [0]) {
    for (patternIndex; patternIndex < pattern.length; patternIndex++) {
        if (pattern[patternIndex] === '#') {
            currBlockLength++;
        }
        else if (pattern[patternIndex] === '.') {
            if (currBlockLength) patternSequence += currBlockLength + '-';
            currBlockLength = 0;
        }
        else if (pattern[patternIndex] === '?') {
            getPossibleSequences(pattern, sequence, lastQMIndex, patternSequence, currBlockLength + 1, patternIndex + 1, numOfSequences);
            if (currBlockLength) patternSequence += currBlockLength + '-';
            getPossibleSequences(pattern, sequence, lastQMIndex, patternSequence, 0, patternIndex + 1, numOfSequences);
            break;
        }
    }
    if (patternIndex === pattern.length) {
        if (currBlockLength) patternSequence += currBlockLength + '-';
        if (patternSequenceToBaseSequence(patternSequence, sequence)) return numOfSequences[0]++;
    }
    return numOfSequences[0];
}

let result = 0;

for (const obj of parsedInput) {
    const { pattern, sequence } = obj;
    const lastQMIndex = pattern.findLastIndex(char => char === '?');
    let curr = getPossibleSequences(pattern, sequence.join('-'), lastQMIndex);
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