<?php
    declare(strict_types=1);

    //input parsing
    $inputArr = [];

    $fh = fopen('adventOfCode6Input.txt','r');
    while ($line = fgets($fh)) {
        array_push($inputArr, $line);
    }
    fclose($fh);

    $twoDArr = [];
    foreach($inputArr as $line) {
        $twoDArr[] = array_values(array_filter(explode(' ', trim($line)), fn($elem) => $elem !== ''));
    }

    // PART 1
    
    $result = 0;

    for ($x = 0; $x < count($twoDArr[0]); $x++) {

        $currSymbol = $twoDArr[count($twoDArr) - 1][$x];
        $currResult = $currSymbol === '*' ? 1 : 0;

        for ($y = 0; $y < count($twoDArr) - 1; $y++) {
            $currNum = (int) $twoDArr[$y][$x];

            if ($currSymbol === '*') {
                $currResult *= $currNum;
            } else {
                $currResult += $currNum;
            }
        }
        $result += $currResult;
    }

    echo $result;

    echo '<br>';

    //PART 2

    $result = 0;

    $splitIndexes = [];

    $twoDArr2 = array_map(fn($row) => str_split($row), $inputArr);

    //find every empty columns between operations
    for ($x = 0; $x < count($twoDArr2[0]); $x++) {
        $isSplit = true;
        for ($y = 0; $y < count($twoDArr2) - 1; $y++) {
            if ($twoDArr2[$y][$x] !== ' ') {
                $isSplit = false;
                break;
            }
        }
        if ($isSplit) {
            $splitIndexes[$x] = true;
        }
    }

    // get all nums with the proper offset taken into account
    $currIndex = 0;
    $numsMatrix = [[]];
    // - 2 to handle \r\n in the input because php is a godforsaken thing
    for ($x = 0; $x < count($twoDArr2[0]) - 2; $x++) {

        if (isset($splitIndexes[$x])) {
            $currIndex++;
            $numsMatrix[] = [];
        }

        $currNum = '';
        for ($y = 0; $y < count($twoDArr2) - 1; $y++) {
            $currDigit = $twoDArr2[$y][$x];
            if ($currDigit !== ' ') {
                $currNum .= $currDigit;
            }
        }
        if ($currNum !== '') $numsMatrix[$currIndex][] = (int) $currNum;
    }

    // do the operation and adds it to the result
    for ($y = 0; $y < count($numsMatrix); $y++) {
        $currSymbol = $twoDArr[count($twoDArr) - 1][$y];
        $result += array_reduce(
            $numsMatrix[$y],
            function($acc, $num) use ($currSymbol) {
                if ($currSymbol === '*') {
                    $acc *= $num;
                } else {
                    $acc += $num;
                }
                return $acc;
            }, $currSymbol === '*' ? 1 : 0
        );
    }

    echo $result;

    