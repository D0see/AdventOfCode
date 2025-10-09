<?php
    declare(strict_types=1);

    //input parsing
    $inputArr = [];
    $fh = fopen('adventOfCode2Input.txt','r');
    while ($line = fgets($fh)) {
        $line = explode(" ",trim($line));
        $line = array_map(function($elem) {
            if (in_array($elem, ['A', 'X'])) {
                return "ROCK";
            } else if (in_array($elem, ['B', 'Y'])) {
                return "PAPER";
            } else if (in_array($elem, ['C', 'Z'])) {
                return "SCISSORS";
            }
        }, $line);
        array_push($inputArr, $line);
    }
    fclose($fh);

    //PART 1

    //return 1 for win, 0 for draw, -1 for loss
    function resolveShifumi(string &$myMove, string &$oppMove): int {
        if ($myMove === $oppMove) return 3;
        else if ($myMove === 'ROCK') {
            return $oppMove === 'SCISSORS' ? 6 : 0;
        } else if ($myMove === 'PAPER') {
            return $oppMove === 'ROCK' ? 6 : 0;
        } else {
            return $oppMove === 'PAPER' ? 6 : 0;
        }
    }

    function calcExtraPoint(string $move) {
        if ($move === "ROCK") return  1;
        else if ($move === "PAPER") return 2;
        else if ($move === "SCISSORS") return 3;
    }

    $result = 0;
    for ($i=0; $i < count($inputArr); $i++) { 
        $oppMove = $inputArr[$i][0];
        $myMove = $inputArr[$i][1];
        $gameResult = resolveShifumi($myMove, $oppMove);
        $gameResult += calcExtraPoint($myMove);
        $result += $gameResult;
    }

    echo $result;
    echo "<br>";

    //PART 2

    function inferMove(string &$outcome, string &$oppMove) {
        if ($outcome === 'ROCK') {
            if ($oppMove === 'ROCK') {
                return 'SCISSORS';
            } else if ($oppMove === 'PAPER') {
                return 'ROCK';
            } else {
                return 'PAPER';
            }
        } else if ($outcome === 'PAPER') {
            return $oppMove;
        } else if ($outcome === 'SCISSORS') {
            if ($oppMove === 'ROCK') {
                return 'PAPER';
            } else if ($oppMove === 'PAPER') {
                return 'SCISSORS';
            } else {
                return 'ROCK';
            }
        }
    }

    $result = 0;
    for ($i=0; $i < count($inputArr); $i++) { 
        $outcome = $inputArr[$i][1];
        $oppMove = $inputArr[$i][0];
        //here we the meaning of the second column symbols changes to mean the result of the game
        $myMove = inferMove($outcome, $oppMove);
        $gameResult = resolveShifumi($myMove, $oppMove);
        $gameResult += calcExtraPoint($myMove);
        $result += $gameResult;
    }

    echo $result;
?>

