<?php
    declare(strict_types=1);

    //input parsing
    $fh = fopen('adventOfCode5Input.txt','r');

    $isAtTopStack = true;
    $stacksStrings = [];
    $orders = [];
    while ($line = fgets($fh)) {
        if ($line[0] === "\r") {
            $isAtTopStack = false;
            continue;
        }
        if ($isAtTopStack) {
            array_push($stacksStrings, str_split($line));
        } else {
            $values = preg_split("(\s|\r)",$line);
            $order = []; 
            foreach ($values as $value) {
                if (is_numeric($value)) array_push($order, key_exists(0, $order) ? $value - 1 : $value);
            }
            array_push($orders, $order);
        }
    }
    fclose($fh);

    $numberOfStacks = (count($stacksStrings[count($stacksStrings) - 1]) - 1) / 4;

    //initialises stacks
    $stacks = [];
    for ($i = 0; $i < $numberOfStacks; $i++) array_push($stacks, []);

    foreach($stacksStrings as $index => $arr) {
        if ($index === ($numberOfStacks - 1)) break;
        for ($i = 0; $i < $numberOfStacks; $i++) {
            $symbolIndex = ($i * 4) + 1;
            if (!key_exists($symbolIndex, $arr)) break;
            if ($arr[$symbolIndex] === ' ') continue;
            array_unshift($stacks[$i], $arr[$symbolIndex]);
        }
    }
    
    //used for part 2
    $stacks2 = $stacks;

    foreach($orders as $order) {
        [$amount, $from, $to] = $order;
        for ($i = 0; $i < $amount; $i++) {
            $currBox = array_pop($stacks[$from]);
            if (is_null($currBox)) break;  
            array_push($stacks[$to], $currBox);
        }
    }

    foreach($stacks as $stack) {
        echo $stack[count($stack) - 1];
    }
    echo "<br>";

    // PART 2

    foreach($orders as $order) {
        [$amount, $from, $to] = $order;
        $movedBoxes = array_slice($stacks2[$from], count($stacks2[$from]) - $amount);
        //update $from stack
        $stacks2[$from] = array_slice($stacks2[$from], 0, count($stacks2[$from]) - $amount);
        //update $to stack
        $stacks2[$to] = array_merge($stacks2[$to], $movedBoxes);
    }

    foreach($stacks2 as $stack) {
        echo $stack[count($stack) - 1];
    }
?>