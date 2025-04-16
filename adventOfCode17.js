const fs = require("fs");
const { off } = require("process");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode17Input.txt", {
  encoding: "utf-8",
});

const splittedByLines = rawInput.split("\r\n");
const separation = splittedByLines.indexOf("");
const registers = splittedByLines
  .slice(0, separation)
  .map((line) => parseInt(line.split(":")[1]))
  .reduce((acc, val, index) => {
    acc[String.fromCharCode(65 + index)] = val;
    return acc;
  }, {});

const program = splittedByLines[splittedByLines.length - 1]
  .split(": ")[1]
  .split(",")
  .map((num) => parseInt(num));

const getComboOperand = (num) => {
  if (num >= 0 && num <= 3) {
    return num;
  } else {
    return registers[String.fromCharCode(61 + num)];
  }
};

//PART 1

let result = [];
for (let index = 0; index < program.length; ) {
  const num = program[index];
  const operand = program[index + 1];
  switch (num) {
    case 0:
      //adv
      registers["A"] = Math.trunc(registers["A"] / 2 ** getComboOperand(operand));
      break;
    case 1:
      //bxl
      registers["B"] = registers["B"] ^ operand;
      break;
    case 2:
      //bst
      registers["B"] = getComboOperand(operand) % 8;
      break;
    case 3:
      //jnz
      if (registers["A"]) index = operand;
      break;
    case 4:
      //bxc
      registers["B"] = registers["B"] ^ registers["C"];
      break;
    case 5:
      //out
      result.push(getComboOperand(operand) % 8);
      break;
    case 6:
      //bdv
      registers["B"] = Math.trunc(registers["A"] / 2 ** getComboOperand(operand));
      break;
    case 7:
      //cdv
      registers["C"] = Math.trunc(registers["A"] / 2 ** getComboOperand(operand));
      break;
  }
  if (num != 3 || !registers["A"]) index +=2;
}

//RESULT
console.log(result.join(","));
