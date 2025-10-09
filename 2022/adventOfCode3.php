<?php
    declare(strict_types=1);

    //input parsing
    $inputArr = [];
    $fh = fopen('adventOfCode3Input.txt','r');
    while ($line = fgets($fh)) {
        array_push($inputArr, str_split($line));
    }
    fclose($fh);

    //PART 1
    function calcPriority(string &$symbol): int {
        return ord($symbol) >= 97 ? 
        intval(ord($symbol)) - 96 : 
        intval(ord($symbol)) - 38;
    }

    $result = 0;

    for ($i = 0; $i < count($inputArr); $i++) { 
        $ruckSack = $inputArr[$i];
        $firstHalf = array_slice($ruckSack, 0, (count($ruckSack) / 2) - 1);
        $secondHalf = array_slice($ruckSack, count($ruckSack) / 2 - 1);

        $topSupplies = array_reduce($firstHalf, function(array $acc, string $val) {
            array_key_exists($val, $acc) ? $acc[$val]++ : $acc[$val] = 1;
            return $acc;
        }, []);
        $bottomSupplies = array_reduce($secondHalf, function(array $acc, string $val) {
            array_key_exists($val, $acc) ? $acc[$val]++ : $acc[$val] = 1;
            return $acc;
        }, []);

        $presentInBothArr = [];
        foreach($ruckSack as $supply) {
            if (array_key_exists($supply, $bottomSupplies) && array_key_exists($supply, $topSupplies)) {
                $presentInBothArr[$supply] = true;
            }
        }

        foreach($presentInBothArr as $key => $value) {
            $result += calcPriority($key);
        }
    }

    echo "{$result} <br>";

    //PART 2
    $result = 0;
    for ($i = 0; $i < count($inputArr); $i+= 3) { 
        $elves = [];
        for ($j = 0; $j <= 2; $j++) {
            $currElve = array_reduce($inputArr[$i + $j], function(array $acc, string $val) {
                array_key_exists($val, $acc) ? $acc[$val]++ : $acc[$val] = 1;
                return $acc;
            }, []);
            array_push($elves, $currElve);
        }
        
        foreach(array_keys($elves[0]) as $supply) {
            foreach(array_slice($elves, 1) as $elve) {
                if (!key_exists($supply, $elve)) continue 2; 
            }
            $result += calcPriority($supply);
            break;
        }
    }

    echo $result;
?>