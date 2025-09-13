const fs = require("fs");
const { parse } = require("path");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode5Input.txt", {
    encoding: "utf-8",
});

const parsedInput = rawInput.split('\r\n').filter(row => row); 
const seeds = parsedInput[0].split(':')[1].trim().split(' ').map(num => Number(num));
//used for part 2
const seedRanges = [];
for (let i = 0; i < seeds.length; i+=2) {
    seedRanges.push({
        rangeStart : seeds[i], 
        rangeEnd : seeds[i] + seeds[i + 1]
    });
}

const maps = [];

let currRanges = [];
for (const row of parsedInput.slice(2)) {
    if (row.match(/[A-Za-z]/)) {
        maps.push(currRanges);
        currRanges = [];
        continue;
    }
    let rowData = row.split(' ').map(num => Number(num));
    currRanges.push({
        sourceRange : {
            start : rowData[1],
            end : rowData[1] + rowData[2],
        },
        outputStart : rowData[0]
    })
}
maps.push(currRanges);

for (let i = 0; i < seeds.length; i++) {
    for (const map of maps) {
        for (const range of map) {
            const {sourceRange, outputStart} = range;
            const {start, end} = sourceRange;
            if (seeds[i] >= start && seeds[i] < end) {
                seeds[i] = outputStart + (seeds[i] - start);
                break;
            }
        }
        
    }
}

console.log(Math.min(...seeds));

//PART 2

let reversedMaps = [];

currRanges = [];
for (const row of parsedInput.slice(2)) {
    if (row.match(/[A-Za-z]/)) {
        reversedMaps.push(currRanges);
        currRanges = [];
        continue;
    }
    let rowData = row.split(' ').map(num => Number(num));
    currRanges.push({
        sourceRange : {
            start : rowData[0],
            end : rowData[0] + rowData[2],
        },
        outputStart : rowData[1]
    })
}
reversedMaps.push(currRanges);
reversedMaps = reversedMaps.reverse();

let location = 1;
while(true) {
    let seedNum = location;

    for (const map of reversedMaps) {
        for (const range of map) {
            const {sourceRange, outputStart} = range;
            const {start, end} = sourceRange;
            if (seedNum >= start && seedNum < end) {
                seedNum = outputStart + (seedNum - start);
                break;
            }
        }
    }
    
    if (isInSeedRanges(seedNum, seedRanges)) {
        console.log(location);
        break;
    }
    location++;
}

function isInSeedRanges(seedNum, seedRanges) {
    for (const {rangeStart, rangeEnd} of seedRanges) {
        if (seedNum >= rangeStart && seedNum < rangeEnd) {
            return true;
        }
    }
    return false;
}