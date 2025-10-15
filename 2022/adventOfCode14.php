<?php
    declare(strict_types=1);

    //input parsing
    $fh = fopen('adventOfCode14Input.txt','r');
    $orders = [];
    while ($line = fgets($fh)) {
        $line = substr($line, 0, strlen($line) - 2);
        $line = explode(' -> ', $line);
        $line = array_map(function($elem) {
            return array_map(function($elem) {
                return (int) $elem;
            },explode(',', $elem));
        }, $line);

        array_push($orders, $line);
    }
    fclose($fh);
    
    //PART 1

    // build grid
    $maxY = 0;
    $maxX = 0;
    foreach($orders as $line) {
        foreach($line as $order) {
            [$currX, $currY] = $order;
            $maxX = max($maxX, $currX);
            $maxY = max($maxY, $currY);
        }
    }
    $maxY += 1; // its offset by one for some reason

    $grid = [];
    for ($y = 0; $y < $maxY; $y++) {
        $currArr = [];
        for ($x = 0; $x < $maxX; $x++) {
            array_push($currArr, ".");
        }
        array_push($grid, $currArr);
    }

    foreach($orders as $line) {
        for ($i = 1; $i < count($line); $i++) {
            [$currX, $currY] = $line[$i - 1];
            [$nextX, $nextY] = $line[$i];
            if ($currX !== $nextX) {
                $start = min($currX, $nextX);
                $end = max($currX, $nextX);
                for ($x = $start; $x <= $end; $x++) {
                    $grid[$currY][$x] = '#';
                }
            } else {
                $start = min($currY, $nextY);
                $end = max($currY, $nextY);
                for ($y = $start; $y <= $end; $y++) {
                    $grid[$y][$currX] = '#';
                }
            }
        }
    }

    class Point {
        public int $y;
        public int $x;

        public function __construct(int $y, int $x) {
            $this->y = $y;
            $this->x = $x;
        }
    }

    // returns false if it drops off the face of the earth else returns true
    function dropGrain(array &$grid, Point &$grain): bool {
        if ($grain->y >= count($grid) - 1) {
            return false;
        }
        if ($grid[$grain->y + 1][$grain->x] === '.') {
            $grain->y++;
            return dropGrain($grid, $grain);
        } else if ($grid[$grain->y + 1][$grain->x - 1] === '.') {
            $grain->y++;
            $grain->x--;
            return dropGrain($grid, $grain);
        } else if ($grid[$grain->y + 1][$grain->x + 1] === '.') {
            $grain->y++;
            $grain->x++;
            return dropGrain($grid, $grain); 
        } else {
            return true;
        }
    }

    $numberOfGrains = 0;
    $currGrid = $grid;
    while (true) {
        $numberOfGrains++;
        $currGrain = new Point(0, 500);
        $grainIsPlaced = dropGrain($currGrid, $currGrain);
        if ($grainIsPlaced) {
            $currGrid[$currGrain->y][$currGrain->x] = 'o';
        } else {
            break;
        }
    }

    echo $numberOfGrains - 1;
    echo "<br>";

    // PART 2

    $currGrid = $grid;

    //increases the length of the board by its height (should be enough since there is an offset to the generator)
    for ($y = 0; $y < $maxY; $y++) {
        for ($x = 0; $x < $maxY; $x++) {
            array_push($currGrid[$y], ".");
        }
    }

    //pushes an empty arr then a floor

    array_push($currGrid, array_map(function($elem) {
        return '.';
    }, $currGrid[0]));

    array_push($currGrid, array_map(function($elem) {
        return '#';
    }, $currGrid[0]));

    echo "<br>";
    echo count($currGrid);
    echo "<br>";
    echo count($currGrid[0]);
    
    $numberOfGrains = 0;
    while (true) {
        $numberOfGrains++;
        $currGrain = new Point(0, 500);
        $grainIsPlaced = dropGrain($currGrid, $currGrain);
        if ($grainIsPlaced) {
            $currGrid[$currGrain->y][$currGrain->x] = 'o';
        } 
        if ($currGrain->y === 0 && $currGrain->x === 500) {
            break;
        }
    }

    foreach ($currGrid as $row) {
        echo json_encode(array_slice($row, 400));
        echo "<br>";
    }

    echo $numberOfGrains;
?>