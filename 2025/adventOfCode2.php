<?php
    declare(strict_types=1);

    //input parsing
    $inputArr = [];
    $fh = fopen('adventOfCode2Input.txt','r');
    while ($line = fgets($fh)) {
        $line = trim($line);
        array_push($inputArr, $line);
    }
    fclose($fh);

    $ranges = explode(',', $inputArr[0]);
    $ranges = array_map(fn($range) => array_map(fn($limit) => (int) $limit, explode('-', $range)), $ranges);

    $result = 0;

    // PART 1
    foreach ($ranges as [$start, $end]) {
        for ($i = $start; $i <= $end; $i++) {

            $temp = (string) $i;
            if (strlen($temp) % 2) continue;

            [$left, $right] = str_split($temp, strlen($temp) / 2);
            if ($left === $right) {
                $result += $i;
            }
        }
    }

    echo $result;
    echo '<br>';

    // PART 2

    $result = 0;
    foreach ($ranges as [$start, $end]) {
        for ($i = $start; $i <= $end; $i++) {
            $temp = (string) $i;

            for ($j = 1; $j <= strlen($temp) / 2; $j++) {
                $arr = str_split($temp, $j);
                // echo json_encode($arr) . '<br>';
                if (count(array_unique($arr)) === 1) {
                    $result += $i;
                    break;
                }
            }
        }
    }

    echo $result;


