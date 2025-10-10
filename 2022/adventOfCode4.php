<?php
    declare(strict_types=1);

    //input parsing
    $inputArr = [];
    $fh = fopen('adventOfCode4Input.txt','r');
    while ($line = fgets($fh)) {
        array_push($inputArr, array_map(function($elem) {
            return trim($elem);
        },preg_split("(-|,)", $line)));
    }
    fclose($fh);

    //PART 1

    $result = 0;
    foreach($inputArr as $data) {
        $firstRangeStart = $data[0];
        $firstRangeEnd = $data[1];
        $secondRangeStart = $data[2];
        $secondRangeEnd = $data[3];
        if (
            ($firstRangeStart >= $secondRangeStart && $firstRangeEnd <= $secondRangeEnd) ||
            ($secondRangeStart >= $firstRangeStart && $secondRangeEnd <= $firstRangeEnd)
           ) {
            $result++;
        }
    }
    echo "{$result} <br>";

    //PART 2

    $result = 0;
    foreach($inputArr as $data) {
        $firstRangeStart = $data[0];
        $firstRangeEnd = $data[1];
        $secondRangeStart = $data[2];
        $secondRangeEnd = $data[3];
        if (
            $firstRangeStart <= $secondRangeEnd &&
            $secondRangeStart <= $firstRangeEnd  
           ) {
            $result++;
        }
    }
    echo $result;
?>