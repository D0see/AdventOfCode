<?php
    declare(strict_types=1);

    //input parsing
    $inputArr = [];
    $fh = fopen('adventOfCode4Input.txt','r');
    while ($line = fgets($fh)) {
        $line = str_split(trim($line));
        array_push($inputArr, $line);
    }
    fclose($fh);

    $result = 0;

    // PART 1
    for ($y = 0; $y < count($inputArr); $y++) {
        for ($x = 0; $x < count($inputArr[0]); $x++) {
            if ($inputArr[$y][$x] !== '@') continue;

            $adjacencyScore = 0;

            foreach( [
                [-1, -1],[-1, 0],[-1, 1],[0, -1],[0, 1],[1, -1],[1, 0],[1, 1]
            ] as $offsetArr) {

                [$yOffset, $xOffset] = $offsetArr;

                if (
                    $y + $yOffset < 0 
                    || $x + $xOffset < 0 
                    || $y + $yOffset >= count($inputArr) 
                    || $x + $xOffset >= count($inputArr[0])
                ) continue;

                if ($inputArr[$y + $yOffset][$x + $xOffset] === '@') $adjacencyScore++;

            }

            if ($adjacencyScore < 4) $result++;
        }
    }

    echo $result;

    echo '<br>';
    
    // PART 2
    $result = 0;

    $removedARollLastIter = true;

    while($removedARollLastIter) {

        $removedARollLastIter = false;
        
        for ($y = 0; $y < count($inputArr); $y++) {
            for ($x = 0; $x < count($inputArr[0]); $x++) {

                if ($inputArr[$y][$x] !== '@') continue;

                $adjacencyScore = 0;

                foreach( [
                    [-1, -1],[-1, 0],[-1, 1],[0, -1],[0, 1],[1, -1],[1, 0],[1, 1]
                ] as $offsetArr) {

                    [$yOffset, $xOffset] = $offsetArr;

                    if (
                        $y + $yOffset < 0 
                        || $x + $xOffset < 0 
                        || $y + $yOffset >= count($inputArr) 
                        || $x + $xOffset >= count($inputArr[0])
                    ) continue;

                    if ($inputArr[$y + $yOffset][$x + $xOffset] === '@') $adjacencyScore++;
                }
                
                if ($adjacencyScore < 4) {
                    $result++;
                    $removedARollLastIter = true;
                    $inputArr[$y][$x] = '.';
                }
            }
        }
    }

    echo $result;
