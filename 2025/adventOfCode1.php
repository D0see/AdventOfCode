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

    //PART 1

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

    //PART 2
    
    $result = 0;

    $currNum = 50;

    foreach($inputArr as $arr) {
        $arr = str_split($arr);
        $dir = $arr[0];
        $amount = (int) implode('', array_slice($arr, 1));

        //i got off by oned way too much for my mental health here so i brute forced it

        if ($dir === 'L') {
            for ($i = 0; $i < $amount; $i++) {
                $currNum--;
                if ($currNum % 100 === 0) {
                    $result++;
                }
            }
        } else {
            for ($i = 0; $i < $amount; $i++) {
                $currNum++;
                if ($currNum % 100 === 0) {
                    $result++;
                }
            }
        }

    }

    echo $result;
?>

