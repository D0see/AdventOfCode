<?php
    declare(strict_types=1);

    //input parsing
    $fh = fopen('adventOfCode9Input.txt','r');
    $orders = [];
    while ($line = fgets($fh)) {
        $line = array_filter(preg_split('(\s|\r\n)', $line), function($elem) {
            return $elem !== '';
        });
        array_push(
            $orders, array_slice($line, 0, 
            $line[count($line) - 1] === "\n" ? count($line) - 2 : count($line))
        );
    }
    fclose($fh);

    //PART 1

    class Point {
        public int $y;
        public int $x;

        public function __construct(int $y = 0, int $x = 0) {
            $this->y = $y;
            $this->x = $x;
        }
    }

    function updatePos(Point &$point, string $direction, int $distance) {
        switch($direction) {
            case 'U':
                $point->y -= $distance;
                break;
            case 'R':
                $point->x += $distance;
                break;
            case 'D':
                $point->y += $distance;
                break;
            case 'L':
                $point->x -= $distance;
                break;
        }
    }

    function pointsAreApart(Point &$point1, Point &$point2) {
        $yDiff = abs($point1->y - $point2->y);
        $xDiff = abs($point1->x - $point2->x);
        return ($xDiff > 1 || $yDiff > 1);
    }

    function walkTail(Point &$head, Point &$tail, array &$visitedPositions, bool $tracked): void {
        if ($tracked) $visitedPositions["{$tail->y}-{$tail->x}"] = true;
        while(pointsAreApart($head, $tail)) {
            $yDiff = $head->y - $tail->y;
            $xDiff = $head->x - $tail->x;
            if ($yDiff < 0) {
                $tail->y -= 1;
            } else if ($yDiff > 0) {
                $tail->y += 1;
            }
            if ($xDiff < 0) {
                $tail->x -= 1;
            } else if ($xDiff > 0) {
                $tail->x += 1;
            }
            if ($tracked) $visitedPositions["{$tail->y}-{$tail->x}"] = true;
        }
    }

    $head = new Point(0, 0);
    $tail = new Point(0, 0);

    $visitedPositions = [];
    foreach($orders as $order) {
        [$direction, $distance] = $order;
        updatePos($head, $direction, (int) $distance);
        walkTail($head, $tail, $visitedPositions, true);
    }

    echo count($visitedPositions);
    echo "<br>";

    //PART 2

    $rope = [new Point(0, 0)];
    for ($i = 0; $i < 9; $i++) {
        array_push($rope, new Point(0, 0));
    }

    $testCounter = 0;
    $visitedPositions = [];
    foreach($orders as $order) {
        [$direction, $distance] = $order;
        for ($j = 0; $j < $distance; $j++) { // this i had to look around for because i couldnt visualize why i needed it
            for ($i = 0; $i < count($rope); $i++) {
                if ($i === 0) updatePos($rope[0], $direction, 1);
                else walkTail(
                    $rope[$i - 1], 
                    $rope[$i], 
                    $visitedPositions, $i === count($rope) - 1
                );
            }    
        }
    }
    echo count($visitedPositions);
?>