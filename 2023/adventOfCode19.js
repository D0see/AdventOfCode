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

function executeWorkFlow(piece, workflow) {
    for (const order of workflow) {
        if (typeof order === 'string') {
            if (order === 'A') return true;
            if (order === 'R') return false;
            return executeWorkFlow(piece, workflows[order]);
        } else {
            const { piecePart, comparator, comparingValue, ifTrue } = order;
            if (eval(`${piece[piecePart]} ${comparator} ${comparingValue}`)) {
                if (ifTrue === 'A') return true;
                if (ifTrue === 'R') return false;
                return executeWorkFlow(piece, workflows[ifTrue]);
            }
        }
    }
}

let result = 0;

for (const piece of pieces) {
    if (executeWorkFlow(piece, workflows.in)) {
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
// and do a recursive call with the next workflow while updating the specified range to a new Min or Max if necessary
// so here for the first order i would do recursiveCall(newPieceWithArangeAtMin2591, rtpWorkFlow)

// once this is done i just calculate the ranges based on the ranges of all objects xmas values
// then i just multiply the ranges values so x * m * a * s