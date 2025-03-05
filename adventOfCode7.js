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
  result = [false],
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
  return result[0];
};

let result = 0;

operations.forEach((operation) => {
  if (hasAWorkingPerm(operation)) result += operation.result;
});

console.log(result);

// PART 2

const hasAWorkingPerm2 = (
  operation,
  result = [false],
  currNumIndex = 0,
  currPerm = undefined
) => {
  if (result[0]) return;
  if (currNumIndex === operation.numbers.length) {
    if (currPerm === operation.result) result[0] = true;
    return;
  }
  hasAWorkingPerm2(
    operation,
    result,
    currNumIndex + 1,
    (currPerm === undefined ? 0 : currPerm) + operation.numbers[currNumIndex]
  );
  hasAWorkingPerm2(
    operation,
    result,
    currNumIndex + 1,
    (currPerm === undefined ? 1 : currPerm) * operation.numbers[currNumIndex]
  );
  hasAWorkingPerm2(
    operation,
    result,
    currNumIndex + 1,
    parseInt(
      (currPerm === undefined ? "" : `${currPerm}`) +
        `${operation.numbers[currNumIndex]}`
    )
  );
  return result[0];
};

let result2 = 0;

operations.forEach((operation) => {
  if (hasAWorkingPerm2(operation)) result2 += operation.result;
});

console.log(result2);
