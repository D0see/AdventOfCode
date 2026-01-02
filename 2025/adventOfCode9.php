<?php
    declare(strict_types=1);

    //input parsing
    
    // points are stored as [x, y] arrays
    $points = [];
    $fh = fopen('adventOfCode9Input.txt','r');
    while ($line = fgets($fh)) {
        $arr = array_map(fn($str) => (int) $str, explode(',', trim($line)));
        array_push($points, $arr);
    }
    fclose($fh);

    // PART 1

    function calcRectangleAreaFromOppositeCorners(array $point1, array $point2): int {
        return (abs($point1[0] - $point2[0]) + 1) *  (abs($point1[1] - $point2[1]) + 1);
    }

    $largestRectangle = 0;
    foreach($points as $index => $point1) {
        for($i = $index + 1; $i < count($points); $i++) {
            $point2 = $points[$i];
            $currArea = calcRectangleAreaFromOppositeCorners($point1, $point2);
            $largestRectangle = $largestRectangle < $currArea ? $currArea : $largestRectangle;
        }
    }

    echo $largestRectangle;
    echo '<br>';

    // PART 2

    // this part was really hard and took me 4hours + until i found working solution 
    // so i kept my reasoning through the problem as i found it to be the most interesting part

    // \===========/ 1st idea : \===========/
    //  brute force by creating a two dimensional array similar to the one in the problem description :
    // - the array must be of size (maxY - minX) arrays inside are just empty associative arrays
    // - offset all the points in $points by minX and minY (saves us from creating some associative arrays)
    // - place every red tiles (#) and join them with green tiles (X)
    // - floodfill the loop with green tiles
    // - do a loop similar to the first one but check the validity of the rectangle 
    //   by checking that every single tile inside of it is either red or green
    // - only check the rectangle that have the possibility of being bigger than our biggest 
    //   validated rectangle (should save some time)

    // this solution isnt viable as the values are too big :(

    // \===========/ 2nd idea : \===========/
    // - this one needs 2 presuppositions to be true to work :
    //      - no two points (red tiles) can touch (diagonally or directly) -> test 1 
    //      - the green tiles line between 2 redtiles are alternating orientations (to be tested) -> test 2
    // - for each points we try to build rectangles with every other points 
    // (except the first and last relative to the starting point)
    // - we try to build a rectangle only if it has a bigger aera than the biggest one we already built
    // - to be a valid a rectangle must have no red tile (point) inside its area

    // this logic ended not being able to discriminate rectangles outside the loop so the idea is a no go

    // \===========/ 3rd idea : \===========/
    // optimised brute-force :
    // - the two d Arr is of size (maxY - minX) arrays inside are just empty associative arrays
    // - we draw the links between red tiles -> links and redtiles are marked with an 'X'
    // - here is the important part :
    //     - from each red tile, we draw a line of green tile in every direction that doesnt already have one
    //     only if the line ends up crossing one of the original green tile lines between 2 points or a red tile
    //     ITS IMPORTANT TO NOT STOP DRAWING THESE LAST LINES IF YOU CROSS ANOTHER ONE WHILE DRAWING IT -> theses lines are marked with a - 'O'
    // - from there we try to build every rectangles between two points that can yield a bigger area than the largest one
    // - we need to check that when we walk around a rectangle we cross at least one 'O' (avoids the snail edge case)
    // TODO : make it so a O line is only drawn if it passes an uneven number of X line b
    // the funny thing is, this solution wouldnt work as if we had only 4 points


    ini_set('memory_limit', '-1');

    //here we get the max points values
    $maxX = 0;
    $maxY = 0;
    for($i = 0; $i < count($points); $i++) {
        $point = $points[$i];
        $maxX = $maxX < $point[0] ? $point[0] : $maxX;
        $maxY = $maxY < $point[1] ? $point[1] : $maxY;
    }

    //here we get the min points values
    $minX = $maxX;
    $minY = $maxY;
    for($i = 0; $i < count($points); $i++) {
        $point = $points[$i];
        $minX = $minX > $point[0] ? $point[0] : $minX;
        $minY = $minY > $point[1] ? $point[1] : $minY;
    }

    $length = $maxX - $minX + 1;
    $height = $maxY - $minY + 1;

    //here we offset every point by the min values for each axis (saves a few associatives array)
    for($i = 0; $i < count($points); $i++) {
        $points[$i][0] =  $points[$i][0] - $minX;
        $points[$i][1] =  $points[$i][1] - $minY;
    }

    $twoDArr = array_fill(0, $height, []);

    //here we fill the twoDArr with the loop (the loop walls are marked as 'X')
    function drawLineBetween2Points(array $point1, array $point2, &$twoDArr): void {
        $lineIsVertical = $point1[0] === $point2[0];
        if ($lineIsVertical) {
            $startingY = min($point1[1], $point2[1]);
            $endingY = max($point1[1], $point2[1]);
            for ($y = $startingY; $y <= $endingY; $y++) {
                $twoDArr[$y][$point1[0]] = 'X';
            }
        } else {
            $startingX = min($point1[0], $point2[0]);
            $endingX = max($point1[0], $point2[0]);
            for ($x = $startingX; $x <= $endingX; $x++) {
                $twoDArr[$point1[1]][$x] = 'X';
            }
        }
    }

        //first we draw the lines between every points in the points list
    for($i = 0; $i < count($points) - 1; $i++) {
        $point1 = $points[$i];
        $point2 = $points[$i + 1];
        drawLineBetween2Points($point1, $point2, $twoDArr);
    }
        //then we draw the line between the last and first points
    drawLineBetween2Points($points[0], $points[count($points) - 1], $twoDArr);

    //for each point we draw 'O' lines reaching inside the loop to the first 'X' encoutered 
    function drawInwardOLinesFromPoint(int $length, int $height, array $point, &$twoDArr) {
        //4directions

        //RIGHT
        $isAValidLine = false;
        $endX = null;
        $currX = $point[0] + 1;
            // first we check that the line for this direction is valid
        while ($currX < $length) {
            if (isset($twoDArr[$point[1]][$currX]) && $twoDArr[$point[1]][$currX] === 'X') {
                if ($currX !== $point[0]) {
                    $isAValidLine = true;
                    $endPoint = $currX;
                }
                break;
            }
            $currX++;
        }
            //then we draw the line if valid
        if ($isAValidLine) {
            $currX = $point[0] + 1;
            while ($currX < $endPoint) {
                $twoDArr[$point[1]][$currX] = 'O';
                $currX++;
            }
        }

        //LEFT
        $isAValidLine = false;
        $endX = null;
        $currX = $point[0] - 1;
            // first we check that the line for this direction is valid
        while ($currX >= 0) {
            if (isset($twoDArr[$point[1]][$currX]) && $twoDArr[$point[1]][$currX] === 'X') {
                if ($currX !== $point[0]) {
                    $isAValidLine = true;
                    $endPoint = $currX;
                }
                break;
            }
            $currX--;
        }
            //then we draw the line if valid
        if ($isAValidLine) {
            $currX = $point[0] - 1;
            while ($currX < $endPoint) {
                $twoDArr[$point[1]][$currX] = 'O';
                $currX--;
            }
        }

        //UP
        $isAValidLine = false;
        $endY = null;
        $currY = $point[1] - 1;
            // first we check that the line for this direction is valid
        while ($currY >= 0) {
            if (isset($twoDArr[$currY][$point[0]]) && $twoDArr[$currY][$point[0]] === 'X') {
                if ($currY !== $point[1]) {
                    $isAValidLine = true;
                    $endPoint = $currY;
                }
                break;
            }
            $currY--;
        }
            //then we draw the line if valid
        if ($isAValidLine) {
            $currY = $point[1] - 1;
            while ($currY > $endPoint) {
                $twoDArr[$currY][$point[0]] = 'O';
                $currY--;
            }
        }

        //DOWN
        $isAValidLine = false;
        $endY = null;
        $currY = $point[1] + 1;
            // first we check that the line for this direction is valid
        while ($currY < $length) {
            if (isset($twoDArr[$currY][$point[0]]) && $twoDArr[$currY][$point[0]] === 'X') {
                if ($currY !== $point[1]) {
                    $isAValidLine = true;
                    $endPoint = $currY;
                }
                break;
            }
            $currY++;
        }
            //then we draw the line if valid
        if ($isAValidLine) {
            $currY = $point[1] + 1;
            while ($currY < $endPoint) {
                $twoDArr[$currY][$point[0]] = 'O';
                $currY++;
            }
        }

    }

    for($i = 0; $i < count($points); $i++) {
        drawInwardOLinesFromPoint($length, $height, $points[$i], $twoDArr);
    }

    // for each points try to build a rectangle if it would be bigger than the biggest validated rectangle we walk all around the rectangle 
    // to verify thats its all tiled up also and that we cross at least one 'O' (to avoid the snail-looking edgecase)
    function rectangleIsWalkable(array $point1, array $point2, &$twoDArr): bool {
        $startingX = min($point1[0], $point2[0]);
        $startingY = min($point1[1], $point2[1]);
        $endingX = max($point1[0], $point2[0]);
        $endingY = max($point1[1], $point2[1]);

        $hasCrossedAO = false;

        for ($y = $startingY; $y <= $endingY; $y++) {
            if (!isset($twoDArr[$y][$point1[0]])) return false;
            if (!isset($twoDArr[$y][$point2[0]])) return false;

            if (!$hasCrossedAO) {
                if ($twoDArr[$y][$point1[0]] === 'O') $hasCrossedAO = true;
                if ($twoDArr[$y][$point2[0]] === 'O') $hasCrossedAO = true;
            }
        }

        for ($x = $startingX; $x <= $endingX; $x++) {
            if (!isset($twoDArr[$point1[1]][$x])) return false;
            if (!isset($twoDArr[$point2[1]][$x])) return false;

            if (!$hasCrossedAO) {
                if ($twoDArr[$point1[1]][$x] === 'O') $hasCrossedAO = true;
                if ($twoDArr[$point1[1]][$x] === 'O') $hasCrossedAO = true;
            }
        }

        return $hasCrossedAO;
    }

    $largestRectangle = 0;
    foreach($points as $index => $point1) {
        for($i = $index + 1; $i < count($points); $i++) {
            $point2 = $points[$i];
            $currArea = calcRectangleAreaFromOppositeCorners($point1, $point2);
            if ($largestRectangle < $currArea) {
                if (rectangleIsWalkable($point1, $point2, $twoDArr)) $largestRectangle = $currArea;
            }
        }
    }

    // //test printing
    // foreach($twoDArr as $arr) {
    //     for ($i = 0; $i < $length; $i++) {
    //         if (!isset($arr[$i])) $arr[$i] = 'E';
    //     }
    //     ksort($arr);
    //     $arr = array_values($arr);
    //     echo json_encode($arr);
    //     echo '<br>';
    // }

    echo $largestRectangle;

    // \===========/ 4th idea : \===========/
    // i could rebuild the 3rd solution but without placing tiles in a two dArr :
    // - i could build ranges of tiles for every x and y positions where there is a point :
    //     - so XtilesRangesX = [Y => [[start, end], [start, end]], XtilesRangesY = [X => [[start, end], [start, end]]
    //     - OtilesRangesX = [Y => [[start, end], [start, end]], OtilesRangesY = [X => [[start, end], [start, end]]
    // then when we "walk the triangle" we just check that its side are covered by both the OtilesRanges and XtilesRanges