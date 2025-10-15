<?php
    declare(strict_types=1);

    //input parsing
    $fh = fopen('adventOfCode13Input.txt','r');
    $lines = [];
    while ($line = fgets($fh)) {
        $line = array_filter(preg_split('(\s|\r\n)', $line), function($elem) {
            return $elem !== '';
        });
        if (count($line) === 0) continue;
        array_push(
            $lines, array_slice($line, 0, 
            $line[count($line) - 1] === "\n" ? count($line) - 2 : count($line))
        );
    }
    fclose($fh);
    
    //PART 1

    function isInCorrectOrder(array $leftArr, array $rightArr): int {

        if (is_array($leftArr) && (count($leftArr) === 0) && is_array($rightArr) && (count($rightArr) === 0)) {
            return 0;
        }

        for ($i = 0; $i < count($leftArr); $i++) {
            $leftElem = $leftArr[$i];
            $rightElem = $rightArr[$i];

            if (is_null($rightElem)) return -1;

            if (is_array($leftElem) && (count($leftElem) === 0) && is_int($rightElem)) {
                return 1;
            }

            if (is_int($leftElem) && is_int($rightElem)) {
                if ($leftElem === $rightElem) {
                    continue;
                } else if ($leftElem > $rightElem) {
                    return -1;
                } else {
                    return 1;
                }
            } else if (is_int($leftElem) && is_array($rightElem)) {
                if (isInCorrectOrder([$leftElem], $rightElem) === 1) {
                    return 1;
                } else if (isInCorrectOrder([$leftElem], $rightElem) === 0) {
                    continue;
                } else {
                    return -1;
                }
            } else if (is_array($leftElem) && is_int($rightElem)) {
                if (isInCorrectOrder($leftElem, [$rightElem]) === 1) {
                    return 1;
                } else if (isInCorrectOrder($leftElem, [$rightElem]) === 0) {
                    continue;
                } else {
                    return -1;
                }
            } else if (is_array($leftElem) && is_array($rightElem)) {
                if (isInCorrectOrder($leftElem, $rightElem) === 1) {
                    return 1;
                } else if (isInCorrectOrder($leftElem, $rightElem) === 0) {
                    continue;
                } else {
                    return -1;
                }
            }
        }

        if (count($rightArr) > count($leftArr)) {
            return 1;  // i was missing this check so i had to look it up
        }
            
        return 0;
    }

    $result = 0;
    for ($i = 0; $i < (count($lines)); $i+=2 ) {
        $firstArr = json_decode($lines[$i][0]);
        $secondArr = json_decode($lines[$i + 1][0]);
        if (isInCorrectOrder($firstArr, $secondArr) >= 0) {
            $result += ($i / 2) + 1;
        }
    }   

    echo $result;
    echo "<br>";


    //PART 2

    array_push($lines, ["[[2]]"], ["[[6]]"]);
    
    usort($lines, function($elem1, $elem2) {
        $elem1 = $elem1[0];
        $elem2 = $elem2[0];
        $result = (isInCorrectOrder(json_decode($elem1), json_decode($elem2)) >= 0) ? -1 : 1;
        return $result;
    });

    $result = 1;

    for ($i = 0; $i < count($lines); $i++) { 
        $currElem = $lines[$i];
        if (($currElem === ["[[2]]"]) || ($currElem === ["[[6]]"])) {
            $result *= ($i + 1);
        }
    }
    echo $result;
?>