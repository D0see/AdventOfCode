<?php
    declare(strict_types=1);

    //input parsing
    $inputArr = [];
    $fh = fopen('adventOfCode3Input.txt','r');
    while ($line = fgets($fh)) {
        $line = trim($line);
        array_push($inputArr, $line);
    }
    fclose($fh);

    $result = 0;

    // PART 1

    function getBiggestJoltage(
        string $str, 
        int $numberOfDigits, 
        string $currResult = '', 
        int $currIndex = 0
        ): int {

        if ($numberOfDigits === 0) return (int) $currResult;

        $currMax = -1;
        $currMaxIndex = -1;

        for ($currIndex; $currIndex < strlen($str) - ($numberOfDigits - 1); $currIndex++) {
            $currVal = (int) $str[$currIndex];
            if ($currMax < $currVal) {
                $currMax = $currVal;
                $currMaxIndex = $currIndex;
            }
        }

        $currResult .= (string) $currMax;

        return getBiggestJoltage($str, $numberOfDigits - 1, $currResult, $currMaxIndex + 1);
    }


    $result = 0;

    //PART 1
    foreach($inputArr as $line) {
        $result += getBiggestJoltage($line, 2);
    }

    echo $result . '<br>';

    $result = 0;

    //PART 2
    foreach($inputArr as $line) {
        $result += getBiggestJoltage($line, 12);
    }

    echo $result;


