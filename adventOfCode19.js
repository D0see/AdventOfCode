const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode19Input.txt", {
  encoding: "utf-8",
});

const splittedByLines = rawInput.split("\r\n");
const indexSeparation = splittedByLines.indexOf(""); 

const arrayOfBricks = splittedByLines[0].split(", ");
const bricks = arrayOfBricks.reduce((obj, val) => {
    obj[val] = true;
    return obj;
}, {})

const maxBrickLength = Math.max(...arrayOfBricks.map(brick => brick.length));

const orders = splittedByLines.slice(indexSeparation + 1);

const OrderIsValid = (order, bricks, maxBrickLength, currIndex = 0, isValid = [false]) => {
    if (isValid[0]) return;
    if (currIndex === order.length) {return isValid[0] = true;}
    for (let i = currIndex; i < Math.min((currIndex + maxBrickLength), order.length); i++) {
        const currBrick = order.slice(currIndex, i + 1);
        console.log(currBrick, "<- test brick");
        console.log(bricks[currBrick]);
        if (bricks[currBrick]) {
            console.log(order.slice(i + 1), " left");
            console.log("_________________")
            OrderIsValid(order.slice(i + 1), bricks, maxBrickLength, i + 1, isValid);
        }
    }
    return isValid[0];
}

let result = 0;
console.log(orders[0]);
for (const order of orders) {
    if(OrderIsValid(order, bricks, maxBrickLength)) result++;
}
console.log(orders[0]);
console.log(result);
