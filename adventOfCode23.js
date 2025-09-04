const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode23Input.txt", {
    encoding: "utf-8",
});

const singleConnections = rawInput.split('\r\n').map(connec => connec.split('-'));

const setOfComputers = new Set();

const connectionsPerComp = {};

for (const connection of singleConnections) {
    connectionsPerComp[connection[0]] ? 
    connectionsPerComp[connection[0]][connection[1]] = true :
    connectionsPerComp[connection[0]] = {[connection[1]] : true};

    connectionsPerComp[connection[1]] ? 
    connectionsPerComp[connection[1]][connection[0]] = true :
    connectionsPerComp[connection[1]] = {[connection[0]] : true};

    setOfComputers.add(connection[0])
    setOfComputers.add(connection[1])
}

const computers = [...setOfComputers]

// PART 1

const unique3WaysConnections = new Set();

for (const connection of singleConnections) {
    for (const computer of computers) {
        if (computer === connection[0] || computer === connection[1]) continue;
        if (!connectionsPerComp[computer][connection[0]] || !connectionsPerComp[computer][connection[1]]) {
            continue;
        }
        unique3WaysConnections.add([connection[0], connection[1], computer].sort().join('-'));
    }
}

const connectionsWithTComputer = [...unique3WaysConnections].filter(connection => {
    for (const computer of connection.split('-')) {
        if (computer.startsWith('t')) return true;
    }
    return false;
})

console.log(connectionsWithTComputer.length);

//PART 2

const lans = singleConnections.map(connection => new Set(connection));

for (const lan of lans) {
    computerLoop : for (const computer of computers) {
        for (const lanComp of lan) {
            if (!connectionsPerComp[computer][lanComp]) continue computerLoop;
        }
        lan.add(computer);
    }
}

console.log([...lans.sort((a,b) => b.size  - a.size)[0]].sort().join(','))

