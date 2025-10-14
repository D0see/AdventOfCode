<?php
    declare(strict_types=1);

    //input parsing
    $fh = fopen('adventOfCode11Input.txt','r');
    $lines = [];
    while ($line = fgets($fh)) {
        $line = array_filter(preg_split('(\s|\r\n)', $line), function($elem) {
            return $elem !== '';
        });
        array_push(
            $lines, array_slice($line, 0, 
            count($line) && $line[count($line) - 1] === "\n" ? count($line) - 2 : count($line))
        );
    }
    fclose($fh);

    //PART 1

    class Monkey {
        public int $monkeyIndex;
        public array $items;
        public array $operation;
        public int $divisionNum;
        public int $trueMonkeyIndex;
        public int $falseMonkeyIndex;

        public function __construct(
            int $monkeyIndex, 
            array $startingItems = [],
            array $operation,
            int $divisionNum,
            int $trueMonkeyIndex,
            int $falseMonkeyIndex
            ) {
            $this->items = $startingItems;
            $this->monkeyIndex = $monkeyIndex;
            $this->operation = $operation;
            $this->divisionNum = $divisionNum;
            $this->trueMonkeyIndex = $trueMonkeyIndex;
            $this->falseMonkeyIndex = $falseMonkeyIndex;
        }
    }

    //builds monkeys array
    $monkeys = [];

    for ($i = 0; $i < count($lines); $i+=7) {
        $monkeyIndex = (int) $lines[$i][1][0];
        $items = array_map(function(string $elem) {
            return substr($elem, 0, 2);
        },array_slice($lines[$i + 1], 2));
        $operation = array_slice($lines[$i + 2], 4);
        $divisionNum = (int) $lines[$i + 3][3];
        $trueMonkeyIndex = (int) $lines[$i + 4][5];
        $falseMonkeyIndex = (int) $lines[$i + 5][5];

        array_push($monkeys, new Monkey(
            $monkeyIndex,
            $items,
            $operation,
            $divisionNum,
            $trueMonkeyIndex,
            $falseMonkeyIndex
        ));
    }

    function applyOperationToItem(string | int $item, array &$operation): int {
        $secondArg = (int) $operation[1];
        if ($operation[0] === '*') {
            return $item * ($operation[1] === "old" ? $item : $secondArg);
        } else {
            return $item + ($operation[1] === "old" ? $item : $secondArg);
        }
    }

    function itemPassesTest(int $item, int $divisionNum): bool {
        return $item % $divisionNum === 0;
    }
    
    //used for part 2;
    $monkeyDivisors = [];
    foreach($monkeys as $monkey) {
        array_push($monkeyDivisors, $monkey->divisionNum);
    }
    $monkeyModulo = gmp_lcm($monkeyDivisors[0], $monkeyDivisors[1]);
    for ($i = 2; $i < count($monkeyDivisors); $i++) {
        $monkeyModulo = gmp_lcm($monkeyModulo, $monkeyDivisors[$i]);
    }
    $monkeyModulo = (int) $monkeyModulo;

    $numOfRounds = 10000; //10k for part 2, 20 for part 1
    $inspectionsCounter = array_map(function($elem) {
        return 0;
    },$monkeys);

    for ($i = 0; $i < $numOfRounds; $i++) {
        for($m = 0; $m < count($monkeys); $m++) {
            $currMonkey = $monkeys[$m];
            while (count($currMonkey->items) > 0) {
                $currItem = array_shift($currMonkey->items);
                //inspects
                $inspectionsCounter[$m]++;
                //apply operation
                $currItem = applyOperationToItem($currItem, $currMonkey->operation);
                //divide worry level by 3 and floor (PART 1 ONLY)
                // $currItem = (int) ($currItem / 3);
                //does modulo magic (PART 2 ONLY)
                $currItem %= $monkeyModulo;
                //test before throwing the item
                if (itemPassesTest($currItem, $currMonkey->divisionNum)) {
                    array_push($monkeys[$currMonkey->trueMonkeyIndex]->items, $currItem);
                } else {
                    array_push($monkeys[$currMonkey->falseMonkeyIndex]->items, $currItem);
                }
            }
        }
    }

    sort($inspectionsCounter);
    $inspectionsCounter = array_reverse($inspectionsCounter);

    echo $inspectionsCounter[0] * $inspectionsCounter[1];
?>