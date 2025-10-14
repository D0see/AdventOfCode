<?php
    declare(strict_types=1);

    //input parsing
    $fh = fopen('adventOfCode12Input.txt','r');
    $map = [];
    while ($line = fgets($fh)) {
        $line = array_filter(preg_split('(\s|\r\n)', $line), function($elem) {
            return $elem !== '';
        });
        array_push(
            $map, array_slice($line, 0, 
            $line[count($line) - 1] === "\n" ? count($line) - 2 : count($line))
        );
    }
    fclose($fh);

    $map = array_map(function($elem) {
        return str_split($elem[0]); 
    }, $map);
    //PART 1

    function getSquareElevation(string $currChar): int {
        return ord($currChar) - 97;
    }

    function nextSquareIsReachable(string $currSquareChar, string $nextSquareChar, int $maxElevationDiff): bool {
        if ($currSquareChar === 'S') $currSquareChar = 'a';
        if ($nextSquareChar === 'S') $nextSquareChar = 'a';
        if ($nextSquareChar === 'E') $nextSquareChar = 'z';
        return ((getSquareElevation($currSquareChar) + $maxElevationDiff)) >= (getSquareElevation($nextSquareChar));
    }

    class Point {
        public int $x;
        public int $y;

        public function __construct(int $y, int $x) {
            $this->y = $y;
            $this->x = $x;
        }
    }

    function getCoordOfChar(array $map, string $needle): Point | null {
        for ($y = 0; $y < count($map); $y++) { 
            for ($x = 0; $x < count($map[0]); $x++) { 
                if ($map[$y][$x] == $needle) {
                    return new Point($y, $x);
                }
            }
        }
        return null;
    }

    function getShortestPathToE(array &$map, Point &$startingCoordinates) {
        $queue = [[$startingCoordinates, 0]];

        $visited = $map;
        for ($y = 0; $y < count($visited); $y++) { 
            for ($x = 0; $x < count($visited[0]); $x++) { 
                $visited[$y][$x] = false;
            }
        }

        while (count($queue) > 0) {
            [$currCoordinates, $numberOfSteps] = array_shift($queue); 
            $currSquareChar = $map[$currCoordinates->y][$currCoordinates->x];

            //exit condition
            if ($currSquareChar === 'E') return $numberOfSteps;

            if ($visited[$currCoordinates->y][$currCoordinates->x]) continue;
            //mark as visited
            $visited[$currCoordinates->y][$currCoordinates->x] = true;

            $nextX = $currCoordinates->x - 1;
            // first we check that the next square is in grid boundary
            if ($nextX >= 0 && !$visited[$currCoordinates->y][$nextX] &&
            // then we check if the next square is lower or at most 1 higher
                nextSquareIsReachable($currSquareChar, $map[$currCoordinates->y][$nextX], 1)) {
                array_push($queue, [new Point($currCoordinates->y, $nextX), $numberOfSteps + 1]);
            }

            $nextX = $currCoordinates->x + 1;
            if ($nextX < count($map[0]) && !$visited[$currCoordinates->y][$nextX] &&
                nextSquareIsReachable($currSquareChar, $map[$currCoordinates->y][$nextX], 1)) {
                array_push($queue, [new Point($currCoordinates->y, $nextX), $numberOfSteps + 1]);
            }

            $nextY = $currCoordinates->y - 1;
            if ($nextY >= 0 && !$visited[$nextY][$currCoordinates->x] &&
                nextSquareIsReachable($currSquareChar, $map[$nextY][$currCoordinates->x], 1)) {
                array_push($queue, [new Point($nextY, $currCoordinates->x), $numberOfSteps + 1]);
            }
            $nextY = $currCoordinates->y + 1;
            if ($nextY < count($map) && !$visited[$nextY][$currCoordinates->x] &&
                nextSquareIsReachable($currSquareChar, $map[$nextY][$currCoordinates->x], 1)) {
                array_push($queue, [new Point($nextY, $currCoordinates->x), $numberOfSteps + 1]);
            }
        }
    }
    $startingCoordinates = getCoordOfChar($map, 'S');

    $result = getShortestPathToE($map, $startingCoordinates);
    echo $result;
    echo "<br>";

    //PART 2

    for ($y = 0; $y < count($map); $y++) { 
        for ($x = 0; $x < count($map[0]); $x++) { 
            if ($map[$y][$x] === 'a') {
                $startingPoint = new Point($y, $x);
                $currResult = getShortestPathToE($map, $startingPoint);
                if ($currResult) {
                    $result = min($result, $currResult);
                }
            }
        }
    }
    echo $result;
?>