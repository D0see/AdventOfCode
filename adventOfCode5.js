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
      if (rulesObj[order[i]]?.[page]) isGoodOrder = false;
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
