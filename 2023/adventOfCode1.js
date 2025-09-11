const fs = require("fs");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode1Input.txt", {
    encoding: "utf-8",
});
let result = 0;
rawInput.split('\r\n').forEach(str => {
    let num1, num2;
    for (let i = 0; i < str.length; i++) {
        if (str[i].match(/[0-9]/)) {
            num1 = str[i];
            break;
        }
    }
    for (let i = str.length - 1; i >= 0; i--) {
        if (str[i].match(/[0-9]/)) {
            num2 = str[i];
            break;
        }
    }
    result += Number(num1 + num2);
});

console.log(result);

//PART 2

const numbers = {
    'one' : '1',
    'two' : '2',
    'three' : '3',
    'four' : '4',
    'five' : '5',
    'six' : '6',
    'seven' : '7',
    'eight' : '8',
    'nine' : '9',
}

let result2 = 0;
rawInput.split('\r\n').forEach(str => {
    let num1, num2;
    leftLoop : for (let i = 0; i < str.length; i++) {
        if (str[i].match(/[0-9]/)) {
            num1 = str[i];
            break;
        } 
        for (const key of Object.keys(numbers)) {
            if (str.slice(i).startsWith(key)) {
                num1 = numbers[key]; 
                break leftLoop;
            }
        }
    }
    rightLoop : for (let i = str.length - 1; i >= 0; i--) {
        if (str[i].match(/[0-9]/)) {
            num2 = str[i];
            break;
        }
        for (const key of Object.keys(numbers)) {
            if (str.slice(i).startsWith(key)) {
                num2 = numbers[key]; 
                break rightLoop;
            }
        }
    }
    result2 += Number(num1 + num2);
});

console.log(result2);


