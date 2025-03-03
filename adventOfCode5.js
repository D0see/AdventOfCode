const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode5Input.txt", {
  encoding: "utf-8",
});

const filteredByLines = rawInput.split("\r\n");
const delimitationIndex = filteredByLines.indexOf("");

// "X | Y" where Y can't come before X
const rules = filteredByLines
  .slice(0, delimitationIndex)
  .map((rule) => rule.split("|"));

const orders = filteredByLines
  .slice(delimitationIndex + 1)
  .map((order) => order.split(","));

//key must be before value in order array
const rulesObj = rules.reduce((acc, rule) => {
  acc[rule[0]]
    ? (acc[rule[0]][rule[1]] = true)
    : (acc[rule[0]] = { [rule[1]]: true });
  return acc;
}, {});

const isValidOrder = (rulesObj, order) => {
  let isGoodOrder = true;
  const currentOrder = [];
  for (let i = 0; i < order.length; i++) {
    currentOrder.forEach((page) => {
      if (rulesObj[order[i]]?.[page]) {
        isGoodOrder = false;
      }
    });
    currentOrder.push(order[i]);
    if (!isGoodOrder) return false;
  }
  return true;
};

const getMiddlePage = (order) => {
  return order[(order.length - 1) / 2];
};

let result = 0;

orders.forEach((order) => {
  if (isValidOrder(rulesObj, order)) result += parseInt(getMiddlePage(order));
});

console.log(result);

// PART 2

const invalidOrders = orders.filter(order => !isValidOrder(rulesObj, order));

const fixOrder = (rulesObj, order) => {
  for (let i = 0; i < order.length; i++) {
    const orderSlice = order.slice(0, i + 1);
    if (isValidOrder(rulesObj, orderSlice)) continue;
    const badPage = order[i];
    for (let j = orderSlice.length - 2; j >= 0; j--) {
      const temp = [...orderSlice].slice(0, orderSlice.length - 1);
      temp.splice(j, 0, badPage);
      if (!isValidOrder(rulesObj, temp)) continue;
      order = temp.slice(0, i + 1).concat(order.slice(i + 1));
      break;
    }
  }
  return order;
}

//weird side effect with for invalidOrders.map but im too tired for this right now
// invalidOrders.map(order => (fixOrder(rulesObj, order));

let fixed = [];
invalidOrders.forEach(order => fixed.push(fixOrder(rulesObj, order)));

let result2 = 0;

fixed.forEach((order) => {
  if (isValidOrder(rulesObj, order)) result2 += parseInt(getMiddlePage(order));
});

console.log(result2);