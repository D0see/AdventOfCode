<?php
    declare(strict_types=1);

    //input parsing
    $inputArr = [];
    $fh = fopen('adventOfCode7Input.txt','r');
    while ($line = fgets($fh)) {
        $line = str_split(trim($line));
        array_push($inputArr, $line);
    }
    fclose($fh);

    // PART 1

    $map = json_decode(json_encode($inputArr));

    $result = 0;

    $y = 0; 
    while ($y < count($map) - 1) {

        for ($x = 0; $x < count($map[$y]) - 1; $x++) {

            //validate that the current char is a tachyon
            if (in_array($map[$y][$x], ['^', '.'])) continue;

            //if next square isnt a splitter we march the tachyon
            if ($map[$y + 1][$x] !== '^') {
                $map[$y + 1][$x] = 'S';
                continue;
            }

            //keeps tracks if the current tachyon was splitted or not
            $splitted = false;

            if ($x > 0 && $map[$y + 1][$x - 1] !== 'S' ) {
                //marks a new tachyon position
                $map[$y + 1][$x - 1] = 'S';
                $splitted = true;
            }

            if ($x < count($map[$y]) && $map[$y + 1][$x + 1] !== 'S' ) {
                $map[$y + 1][$x + 1] = 'S';
                $splitted = true;
            }

            if ($splitted) $result++;
        }

        $y++;
    }
 
    echo $result;

    echo '<br>';

    // PART 2

    //brute force dfs with memo

    function simulateTachyon(int $y, int $x, array $map, &$memo = [], $result = 1): int {

        //moves the tachyon downwards until it hits a splitter or reaches the end of the map
        while ($y < count($map) - 1 && $map[$y][$x] !== '^') {
            $y++;
        }

        if ($map[$y][$x] === '^') {

            $result++;

            if ($x - 1 >= 0) {
                //if we have a value memoize for this splitter splits, adds it to the result
                if (isset($memo[$y][$x - 1])) {
                    $result += $memo[$y][$x - 1];
                //else we simulate a tachyon starting from there and record its number of possible paths in the memo
                } else {
                    $memo[$y][$x - 1] = simulateTachyon($y, $x - 1, $map, $memo, 0);
                    $result += $memo[$y][$x - 1];
                }
            }

            if ($x + 1 <= count($map[$y])) {
                if (isset($memo[$y][$x + 1])) {
                    $result += $memo[$y][$x + 1];
                } else {
                    $memo[$y][$x + 1] = simulateTachyon($y, $x + 1, $map, $memo, 0);
                    $result += $memo[$y][$x + 1];
                }
            }

        }

        return $result;
    }

    $map = json_decode(json_encode($inputArr));

    $startingX = -1;

    for ($x = 0; $x < count($map[0]); $x++) { 
        if ($map[0][$x] === 'S') {
            $startingX = $x;
            break;
        }
    }

    echo simulateTachyon(0, $startingX, $map);