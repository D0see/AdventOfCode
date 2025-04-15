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

console.log(registers);

const getComboOperand = (num) => {
  if (num >= 0 && num <= 3) {
    return num;
  } else {
    return registers[String.fromCharCode(61 + num)];
  }
};

//PART 1
console.log(program);

let result = [];
programLoop: for (let index = 0; index < program.length; ) {
  let offset = 0;
  const num = program[index];
  const operand = program[index + 1];
  console.log(num, "(", operand, ")", "index : ", index);
  console.log(registers);
  switch (num) {
    case 0:
      //adv
      console.log("case", 0);
      console.log(getComboOperand(operand), "combOperand");
      registers["A"] = Math.trunc(
        registers["A"] / 2 ** getComboOperand(operand)
      );
      index += 2;
      break;
    case 1:
      //bxl
      console.log("case", 1);
      registers["B"] = registers["B"] ^ operand;
      index += 2;
      break;
    case 2:
      //bst
      console.log("case", 2);
      registers["B"] = getComboOperand(operand) % 8;
      index += 2;
      break;
    case 3:
      //jnz
      console.log("case", 3);
      if (registers["A"]) {
        console.log("registers");
        index = operand;
      } else {
        index += 2;
      }
      console.log("index", index);

      break;
    case 4:
      //bxc
      console.log("case", 4);
      registers["B"] = registers["B"] ^ registers["C"];
      index += 2;
      break;
    case 5:
      // out
      console.log("case", 5);
      console.log("outputted", getComboOperand(operand) % 8);
      result.push(getComboOperand(operand) % 8);
      index += 2;
      break;
    case 6:
      //bdv
      console.log("case", 6);
      registers["B"] = Math.trunc(
        registers["A"] / 2 ** getComboOperand(operand)
      );
      index += 2;
      break;
    case 7:
      //cdv
      console.log("case", 7);
      registers["C"] = Math.trunc(
        registers["A"] / 2 ** getComboOperand(operand)
      );
      index += 2;
      break;
    default:
      "it bugged";
      break;
  }
}

console.log(result.join(","));

// The jnz instruction (opcode 3) does nothing if the A register is 0. However, if the A register is not zero, it jumps by setting the instruction pointer to the value of its literal operand;
// if this instruction jumps, the instruction pointer is not increased by 2 after this instruction.

// The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C, then stores the result in register B.
// (For legacy reasons, this instruction reads an operand but ignores it.)

// The out instruction (opcode 5) calculates the value of its combo operand modulo 8, then outputs that value. (If a program outputs multiple values, they are separated by commas.)

// The bdv instruction (opcode 6) works exactly like the adv instruction except that the result is stored in the B register. (The numerator is still read from the A register.)

// The cdv instruction (opcode 7) works exactly like the adv instruction except that the result is stored in the C register. (The numerator is still read from the A register.)
