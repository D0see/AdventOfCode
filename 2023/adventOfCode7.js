const fs = require("fs");

// INPUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode7Input.txt", {
    encoding: "utf-8",
});

const hands = rawInput.split('\r\n').map(row => row.split(' ')).reduce((acc, val) => {
    acc.push({
        hand : val[0],
        bid : Number(val[1])
    })
    return acc;
}, []);

let cardValues = {
    '2' : 0,
    '3' : 1,
    '4' : 2,
    '5' : 3,
    '6' : 4,
    '7' : 5,
    '8' : 6,
    '9' : 7,
    'T' : 8,
    'J' : 9,
    'Q' : 10,
    'K' : 11,
    'A' : 12,
}

let evaluateHand = (hand) => {
    const handMap = hand.split('').reduce((map, letter) => {
        map[letter] = map[letter] ? map[letter] + 1 : 1;
        return map;
    }, {});
    const sameCardNum = Math.max(...Object.values(handMap));
    if (sameCardNum > 3) return sameCardNum;
    else if (sameCardNum === 3) return Object.values(handMap).includes(2) ? 3 : 2;
    else if (sameCardNum === 2) return Object.values(handMap).filter(val => val === 2).length === 2 ? 1 : 0;
    return -1;
}

//return 1 for a, -1 for b
function mostValuableFirstCard(aHand, bHand, cardValues) {
    for (let i = 0; i < aHand.length; i++) {
        if (cardValues[aHand[i]] > cardValues[bHand[i]]) return 1;
        else if (cardValues[aHand[i]] < cardValues[bHand[i]]) return -1;
    }
}

hands.sort((a, b) => {
    const aHandVal = evaluateHand(a.hand);
    const bHandVal = evaluateHand(b.hand);
    if (aHandVal === bHandVal) return mostValuableFirstCard(a.hand, b.hand, cardValues);
    return aHandVal - bHandVal;
})

let result = 0;
for (let i = 0; i < hands.length; i++) {
    result += (i + 1) * hands[i].bid;
}

console.log(result);

// PART 2

cardValues.J = -1;

evaluateHand = (hand) => {
    const handMap = hand.split('').reduce((map, letter) => {
        map[letter] = map[letter] ? map[letter] + 1 : 1;
        return map;
    }, {});
    let temp = handMap.J;
    handMap.J = 0;
    let sameCardNum = Math.max(...Object.values(handMap));
    handMap.J = temp;
    sameCardNum = sameCardNum === 0 ? temp : sameCardNum;
    for (const key of Object.keys(handMap)) {
        if (handMap[key] === sameCardNum && key !== 'J') {
            handMap[key] += (handMap?.J || 0);
            handMap.J = 0;
            sameCardNum = handMap[key];
            break;
        }
    }

    if (sameCardNum > 3) return sameCardNum;
    else if (sameCardNum === 3) return Object.values(handMap).includes(2) ? 3 : 2;
    else if (sameCardNum === 2) return Object.values(handMap).filter(val => val === 2).length === 2 ? 1 : 0;
    return -1;
}

hands.sort((a, b) => {
    const aHandVal = evaluateHand(a.hand);
    const bHandVal = evaluateHand(b.hand);
    if (aHandVal === bHandVal) return mostValuableFirstCard(a.hand, b.hand, cardValues);
    return aHandVal - bHandVal;
})

let result2 = 0;
for (let i = 0; i < hands.length; i++) {
    result2 += (i + 1) * hands[i].bid;
}

console.log(result2);
