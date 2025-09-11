const fs = require('fs');

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync('./adventOfCode21Input.txt', {
  encoding: 'utf-8',
});

const codes = rawInput.split('\r\n');

// +---+---+---+
// | 7 | 8 | 9 |
// +---+---+---+
// | 4 | 5 | 6 |
// +---+---+---+
// | 1 | 2 | 3 |
// +---+---+---+
//     | 0 | A |
//     +---+---+

const numericPad = [
  ['7','8','9'],
  ['4','5','6'],
  ['1','2','3'],
  [undefined, '0', 'A']
]

const numericPadInitialPos = {
  y : 3,
  x : 2
}

//     +---+---+
//     | ^ | A |
// +---+---+---+
// | < | v | > |
// +---+---+---+

const directionnalPad = [
  [undefined,'^','A'],
  ['<','v','>'],
]

const directionnalPadInitialPos = {
  y : 0,
  x : 2
}

function getSequenceThroughPad(code, pad, initialPos, ShortestPathTo) {
  let {y, x} = initialPos;
  let path = [];
  for (const symbol of code) {
    const {symbolY, symbolX, symbolPath} = ShortestPathTo(pad, symbol, y, x);
    y = symbolY;
    x = symbolX;
    path = path.concat(symbolPath, ['A']);
  }
  return path;
}

function dirPadgetShortestPathTo(pad, symbol, currY, currX) {
  let [targetY, targetX] = findSymbolPos(pad, symbol);
  const currPath = [];

    while (currY < targetY && pad[currY + 1]?.[currX]) {
      currPath.push('v');
      currY++;
    }
    while (currX < targetX && pad[currY]?.[currX + 1]) {
      currPath.push('>');
      currX++;
    }
    while (currY > targetY && pad[currY - 1]?.[currX]) {
      currPath.push('^');
      currY--;
    }
    while (currX > targetX && pad[currY]?.[currX - 1]) {
      currPath.push('<');
      currX--;
    }

  return {symbolY : targetY, symbolX : targetX, symbolPath : currPath}
}

function numPadgetShortestPathTo(pad, symbol, currY, currX) {
  let [targetY, targetX] = findSymbolPos(pad, symbol);
  const currPath = [];

  while (currY > targetY && pad[currY - 1]?.[currX]) {
    currPath.push('^');
    currY--;
  }
  while (currX < targetX && pad[currY]?.[currX + 1]) {
    currPath.push('>');
    currX++;
  }
  while (currX > targetX && pad[currY]?.[currX - 1]) {
    currPath.push('<');
    currX--;
  }
  while (currY < targetY && pad[currY + 1]?.[currX]) {
    currPath.push('v');
    currY++;
  }
  

  return {symbolY : targetY, symbolX : targetX, symbolPath : currPath}
}

function findSymbolPos(pad, symbol) {
  for (let y = 0; y < pad.length; y++) {
    for (let x = 0; x < pad[0].length; x++) {
      if (pad[y][x] === symbol) {
        return [y, x]
      }
    }
  }
} 

let result = 0;

for (const code of codes) {
  console.log(code);
  const numericPadpath = getSequenceThroughPad(code, numericPad, numericPadInitialPos, numPadgetShortestPathTo);
  console.log('numericPadpath', code, numericPadpath)
  const directionnalPadPath = getSequenceThroughPad(numericPadpath, directionnalPad, directionnalPadInitialPos, dirPadgetShortestPathTo);
  console.log('directionnalPadPath', directionnalPadPath);
  const directionnalPadPath2 = getSequenceThroughPad(directionnalPadPath, directionnalPad, directionnalPadInitialPos, dirPadgetShortestPathTo);
  console.log(directionnalPadPath2.join(''))
  console.log(directionnalPadPath2.length);
  result += parseInt(code.slice(0, code.length - 1) * directionnalPadPath2.length);
}

console.log(result);

//DOESNT WORK HEHE