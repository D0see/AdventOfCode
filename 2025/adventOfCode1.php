<?php
    declare(strict_types=1);

    //input parsing
    $inputArr = [];
    $fh = fopen('adventOfCode1Input.txt','r');
    while ($line = fgets($fh)) {
        $line = trim($line);
        array_push($inputArr, $line);
    }
    fclose($fh);

    $result = 0;

    $currNum = 50;

    foreach($inputArr as $arr) {
        $arr = str_split($arr);
        $dir = $arr[0];
        $amount = (int) implode('', array_slice($arr, 1));

        if ($dir === 'L') {
            $currNum -= $amount;
        } else {
            $currNum += $amount;
        }

        if ($currNum % 100 === 0) {
            $result++;
        }
    }

    echo $result;
?>

