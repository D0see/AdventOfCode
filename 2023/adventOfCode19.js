const fs = require("fs");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode19Input.txt", {
    encoding: "utf-8",
});

const parsedInput = rawInput.split('\r\n');

const workflows = parsedInput.slice(0, parsedInput.findIndex(row => !row))
.reduce((obj, str) => {
    const label = str.slice(0,str.indexOf('{'));
    str = str.slice(str.indexOf('{') + 1, -1);
    const orders = str.split(',').map(order => {
        if (!order.includes(':')) return order;
        order = order.split(':');
        return {
            piecePart : order[0][0],
            comparator : order[0][1],
            comparingValue : Number(order[0].slice(2)),
            ifTrue : order[1]
        }
    })
    obj[label] = orders;
    return obj;
}, {});

const pieces = parsedInput.slice(parsedInput.findIndex(row => !row) + 1)
.map(piece => {
    piece = piece.slice(1, -1).split(',')
    .map(piecePart => piecePart.split('='))
    .reduce((obj, arr) => {
        obj[arr[0]] = Number(arr[1]);
        return obj;
    }, {});
    return piece;
})

function executeWorkflow(piece, workflow) {
    for (const order of workflow) {
        if (typeof order === 'string') {
            if (order === 'A') return true;
            if (order === 'R') return false;
            return executeWorkflow(piece, workflows[order]);
        } else {
            const { piecePart, comparator, comparingValue, ifTrue } = order;
            if (eval(`${piece[piecePart]} ${comparator} ${comparingValue}`)) {
                if (ifTrue === 'A') return true;
                if (ifTrue === 'R') return false;
                return executeWorkflow(piece, workflows[ifTrue]);
            }
        }
    }
}

let result = 0;

for (const piece of pieces) {
    if (executeWorkflow(piece, workflows.in)) {
        result += Object.values(piece).reduce((acc, val) => acc + val, 0);
    }
}

console.log(result);

//PART 2
// in{a>2590:rtp,s<1459:bc,qh}
// ok so assuming we start here, my basic starting piece could be :
// {x : {min : 0 ,max : Infinity} , m : {min : 0 ,max : Infinity}, 
//  a : {min : 0 ,max : Infinity}, s : {min : 0 ,max : Infinity} }
// for each workflows if i can pass the order with my current ranges i will copy my object
// and do a recursive call with the next workflow while updating the specified range 
// to a new Min or Max if necessary
// so here for the first order i would do recursiveCall(newPieceWithArangeAtMin2591, rtpWorkFlow)

// once this is done i just calculate the ranges based on the ranges of all objects 
// who ended up passing xmas values
// then i just multiply the ranges values so x * m * a * s

const basePiece = {
    x : {min : 1 ,max : 4000}, 
    m : {min : 1 ,max : 4000}, 
    a : {min : 1 ,max : 4000}, 
    s : {min : 1 ,max : 4000} 
}

//here lies the bug
function traverseWorkflows(validPieces, basePiece, workflow) {
    let currPiece = structuredClone(basePiece);
    for (const order of workflow) {
        if (typeof order === 'string') {
            if (order === 'A') {
                validPieces.push(structuredClone(currPiece));
                return;
            }
            if (order === 'R') return;
            return traverseWorkflows(validPieces, currPiece, workflows[order]);
        } else {
            const { piecePart, comparator, comparingValue, ifTrue } = order;
            if (comparator === '>') {
                if (currPiece[piecePart].max > comparingValue) {
                    let tempPiece = structuredClone(currPiece);
                    tempPiece[piecePart].min = comparingValue + 1;
                    if (ifTrue === 'R') return;
                    if (ifTrue === 'A') {
                        validPieces.push(tempPiece);
                        return;
                    }
                    traverseWorkflows(validPieces, tempPiece, workflows[ifTrue]);
                    //updates currPiece
                    currPiece[piecePart].max = comparingValue;
                }
            } else {
                if (currPiece[piecePart].min < comparingValue) {
                    let tempPiece = structuredClone(currPiece);
                    tempPiece[piecePart].max = comparingValue - 1;
                    if (ifTrue === 'R') return;
                    if (ifTrue === 'A') {
                        validPieces.push(tempPiece);
                        return;
                    }
                    traverseWorkflows(validPieces, tempPiece, workflows[ifTrue]);
                    //updates currPiece
                    currPiece[piecePart].min = comparingValue;
                }
            }
        }
    }
}

const validPieces = [];

traverseWorkflows(validPieces, basePiece, workflows.in);

console.log(validPieces)

let result2 = 0;

for (const piece of validPieces) {
    currResult = 1;
    for (const {min, max} of Object.values(piece) ) {
        currResult *= (max - min);
    }
    result2 += currResult
}

console.log(result2);

//256000000000000
//92866767062611
