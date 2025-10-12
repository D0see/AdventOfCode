<?php
    declare(strict_types=1);
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
    ini_set('max_execution_time', 240); // default 30s
    ini_set('memory_limit', '512M');

    //input parsing
    $fh = fopen('adventOfCode8Input.txt','r');
    $map = [];
    while ($line = fgets($fh)) {
        $line = str_split($line);
        array_push(
            $map, array_slice($line, 0, 
            $line[count($line) - 1] === "\n" ? count($line) - 2 : count($line))
        );
    }
    fclose($fh);

    //PART 1

    $visibiltyMap = json_decode(json_encode($map));
    for ($y = 0; $y < count($map); $y++) {
        $currHeight = -1;
        for ($x = 0; $x < count($map[0]); $x++) {
            if ($map[$y][$x] > $currHeight) {
                $visibiltyMap[$y][$x] = -1; // flagged as visible
                $currHeight = $map[$y][$x];
            }
        }
        $currHeight = -1;
        for ($x = count($map[0]) - 1; $x >= 0; $x--) {
            if ($map[$y][$x] > $currHeight) {
                $visibiltyMap[$y][$x] = -1;
                $currHeight = $map[$y][$x];
            }
        }
    }

    for ($x = 0; $x < count($map[0]); $x++) {
        $currHeight = -1;
        for ($y = 0; $y < count($map); $y++) {
            if ($map[$y][$x] > $currHeight) {
                $visibiltyMap[$y][$x] = -1;
                $currHeight = $map[$y][$x];
            }
        }
        $currHeight = -1;
        for ($y = count($map) - 1; $y >= 0; $y--) {
            if ($map[$y][$x] > $currHeight) {
                $visibiltyMap[$y][$x] = -1;
                $currHeight = $map[$y][$x];
            }
        }
    }

    $result = 0;

    for ($y = 0; $y < count($visibiltyMap); $y++) {
        for ($x = 0; $x < count($visibiltyMap[0]); $x++) {
            if ($visibiltyMap[$y][$x] === -1) {
                $result++;
            }
        }
    }

    echo $result;
    echo "<br>";

    // PART 2

    function calculateTreeHouseScore(array &$map, int $y, int $x) : int {
        $result = 1;

        $treeHouseHeight = $map[$y][$x];
        for ($i = $y + 1; $i < count($map); $i++) {
            if ($map[$i][$x] >= $treeHouseHeight) {
                $mod = ($i - $y);
                $result *= ($i - $y);
                break;
            }
            if ($i === (count($map) - 1)) {
                $result *= ($i - $y);
            }
        }

        for ($i = $y - 1; $i >= 0; $i--) {
            if ($map[$i][$x] >= $treeHouseHeight) {
                $result *= ($y - $i);
                break;
            }
            if ($i === 0) {
                $result *= ($y - $i);
            }
        }

        for ($i = $x + 1; $i < count($map[0]); $i++) {
            if ($map[$y][$i] >= $treeHouseHeight) {
                $result *= ($i - $x);
                break;
            }
            if ($i === (count($map[0]) - 1)) {
                $result *= ($i - $x);
            }
        }

        for ($i = $x - 1; $i >= 0; $i--) {
            if ($map[$y][$i] >= $treeHouseHeight) {
                $result *= ($x - $i);
                break;
            }
            if ($i === 0) {
                $result *= ($x - $i);
            }
        }

        return $result;
    }

    $result = -1;
    for ($y = 1; $y < count($map) - 1; $y++) {
        for ($x = 1; $x < count($map[0]) - 1; $x++) {
            $currTreeHouseScore = calculateTreeHouseScore($map, $y, $x);
            if ($currTreeHouseScore > $result) {
                $result = $currTreeHouseScore;
            }
        }
    }

    echo $result;
?>