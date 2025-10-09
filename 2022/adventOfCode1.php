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
    $dwarfCalorieCounter = 0;
    for ($i = 0; $i < count($inputArr); $i++) {
        if ($inputArr[$i] === '') {
            $result = max($result, $dwarfCalorieCounter);
            $dwarfCalorieCounter = 0;
            continue;
        }
        $dwarfCalorieCounter += intval($inputArr[$i], 10);
    }
    $result = max($result, $dwarfCalorieCounter);

    echo "part 1 {$result} <br>";

    //PART 2

    function updateRanking(array &$arr, int $score): void {
        $temp = null;
        for ($i = 0; $i < count($arr); $i++) {
            if ($temp !== null) {
                $held = $arr[$i];
                $arr[$i] = $temp;
                $temp = $held;
                
            } else if ($arr[$i] < $score) {
                $temp = $arr[$i];
                $arr[$i] = $score;
            }
        }
    }

    $top3 = [0, 0, 0];
    $dwarfCalorieCounter = 0;
    for ($i = 0; $i < count($inputArr); $i++) {
        if ($inputArr[$i] === '') {
            updateRanking($top3, $dwarfCalorieCounter);
            $dwarfCalorieCounter = 0;
            continue;
        }
        $dwarfCalorieCounter += intval($inputArr[$i], 10);
    }
    updateRanking($top3, $dwarfCalorieCounter);
    
    $result = 0;
    for ($i = 0; $i < count($top3); $i++) {
        $result += $top3[$i];
    }
    
    echo "part 2 {$result}";
?>

