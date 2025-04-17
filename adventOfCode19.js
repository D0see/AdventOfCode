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
}, {});

const maxBrickLength = Math.max(...arrayOfBricks.map((brick) => brick.length));

const orders = splittedByLines.slice(indexSeparation + 1);

const impossibleOrders = {};

const OrderIsValid = (
  order,
  bricks,
  maxBrickLength,
  result = [false],
  impossibleOrders
) => {
  if (result[0]) return result[0];
  if (!order.length) {
    return (result[0] = true);
  }
  const iterator = Math.min(order.length, maxBrickLength);
  for (let i = 1; i <= iterator; i++) {
    const currBrick = order.slice(0, i);
    if (bricks[currBrick]) {
      OrderIsValid(
        order.slice(i),
        bricks,
        maxBrickLength,
        result,
        impossibleOrders
      );
    }
  }
  return result[0];
};

// let result = 0;
// for (const order of orders) {
//   console.count("order");
//   if (OrderIsValid(order, bricks, maxBrickLength, impossibleOrders)) result++;
// }

let result = 0;
if (
  OrderIsValid(
    "uwrbubuwrwgbubguguurwwurbrurbwbwwwgbrwwwg",
    bricks,
    8,
    impossibleOrders
  )
)
  result++;

console.log(result);
