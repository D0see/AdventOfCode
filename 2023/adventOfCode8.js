const math = require("mathjs");
const fs = require("fs");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode8Input.txt", {
    encoding: "utf-8",
});

const parsedInput = rawInput.split('\r\n').filter(row => row); 

const path = parsedInput[0].split('');
const nodes = parsedInput.slice(1).reduce((acc, row) => {
    const data = row.split(' ');
    acc[data[0]] = {
        val : data[0],
        left : data[2].slice(1, -1),
        right : data[3].slice(0, -1)
    }
    return acc;
}, {});

for (const key of Object.keys(nodes)) {
    nodes[key].left = nodes[nodes[key].left];
    nodes[key].right = nodes[nodes[key].right];
}

let result = 0;
let currNode = nodes['AAA'];

outerLoop : while(true) {
    for (const dir of path) {
        if (currNode.val === 'ZZZ') break outerLoop;

        switch(dir) {
            case 'L':
                currNode = currNode.left;
                break;
            case 'R':
                currNode = currNode.right;
                break;
        }
        result++;
    }
}

console.log(result);

// PART 2

let currNodes = Object.keys(nodes).reduce((acc, key) => {
    if (key.endsWith('A')) acc.push(nodes[key])
    return acc;
}, []);

for (let i = 0; i < currNodes.length; i++) {
    let currNode = currNodes[i];
    visitedPath = {};

    let counter = 0;
    outerLoop : while (true) {
        for (const dir of path) {
            if (currNode.val.endsWith('Z')) {
                currNodes[i] = counter;
                break outerLoop;
            } else {
                visitedPath[currNode.val] = true;
            }
            switch(dir) {
                case 'L':
                    currNode = currNode.left;
                    break;
                case 'R':
                    currNode = currNode.right;
                    break;
            }
            counter++;
        }
    }
}
console.log(currNodes)

console.log(math.lcm(...currNodes))

//for this part 2 i had bad intuitions and had to search for ideas on the internet. its still not clear
//to me why the first cycle couldnt shorter than the subsequent ones