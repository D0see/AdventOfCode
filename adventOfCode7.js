const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode7Input.txt", {
  encoding: "utf-8",
});

const operations = rawInput
  .split("\r\n")
  .map((line) => line.split(":"))
  .map((line) => ({
    result: parseInt(line[0]),
    numbers: line[1]
      .split(" ")
      .slice(1)
      .map((number) => parseInt(number)),
  }));

// PART 1

const hasAWorkingPerm = (
  operation,
  result,
  currNumIndex = 0,
  currPerm = undefined
) => {
  if (result[0]) return;
  if (currNumIndex === operation.numbers.length) {
    if (currPerm === operation.result) result[0] = true;
    return;
  }
  hasAWorkingPerm(
    operation,
    result,
    currNumIndex + 1,
    (currPerm === undefined ? 0 : currPerm) + operation.numbers[currNumIndex]
  );
  hasAWorkingPerm(
    operation,
    result,
    currNumIndex + 1,
    (currPerm === undefined ? 1 : currPerm) * operation.numbers[currNumIndex]
  );
};

let result = 0;

let hasAWorkingPermResultCatcher;
operations.forEach((operation) => {
  hasAWorkingPermResultCatcher = [false];
  hasAWorkingPerm(operation, hasAWorkingPermResultCatcher);
  if (hasAWorkingPermResultCatcher[0]) result += operation.result;
});

console.log(result);
