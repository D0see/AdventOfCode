const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode24Input.txt", {
  encoding: "utf-8",
});

const splittedByLines = rawInput.split("\r\n");
const separation = splittedByLines.indexOf("");

const wiresState = splittedByLines.slice(0, separation).reduce((acc, val) => {
    const [name, state] = val.split(':');
    acc[name] = Number(state);
    return acc;
}, {})

const wireActions = splittedByLines.slice(separation + 1).map(line => {
    const [A, operation, B, _, target] = line.split(' ');
    return {
        A,
        operation,
        B,
        target
    }
});

const getOperationResult = (a, b, operation) => {
    switch(operation) {
        case 'AND':
            return (a + b === 2) ? 1 : 0;
        case 'XOR':
            return (a + b === 1) ? 1 : 0;
        case 'OR':
            return ((a + b === 2) || (a + b === 1)) ? 1 : 0;
    }
}

while (wireActions.length) {
    for (const [index, wireAction] of wireActions.entries()) {
        const {A, B, operation, target} =  wireAction;
        if (wiresState[A] === undefined || wiresState[B] === undefined) continue;
        wiresState[target] = getOperationResult(wiresState[A], wiresState[B], operation);
        wireActions.splice(index, 1);
    }
}
const Zbits = Object.keys(wiresState).filter(wireName => wireName.startsWith('z'))
.sort((a, b) => Number(b.slice(1)) -  Number(a.slice(1)))
.map(wireName => wiresState[wireName]).join('');


console.log(parseInt(Zbits, 2));

