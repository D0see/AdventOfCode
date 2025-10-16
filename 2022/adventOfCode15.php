<?php
    declare(strict_types=1);

    //input parsing
    $fh = fopen('adventOfCode15Input.txt','r');
    $orders = [];
    while ($line = fgets($fh)) {
        $line = array_values(array_filter(preg_split('(=|\s|,|:)', $line), function($elem) {
            return is_numeric($elem);
        }));
        $line = array_map(function($elem) {
            $elem = (int) $elem;
            return $elem;   
        },$line);

        array_push($orders, $line);
    }
    fclose($fh);
    
    // PART 1

    function getRangeOfOverlapWithRow(int $rowNumber, int $sensorX, int $sensorY, int $sensorRadius): array {
        $distanceToRow = abs($sensorY - $rowNumber);
        $left = $sensorX - $sensorRadius + $distanceToRow;
        $right = $sensorX + $sensorRadius - $distanceToRow;
        if ($left > $right) return [];
        return [$left, $right];
    }

    $ranges = [];

    foreach($orders as $index => $line) {
        [$sensorX, $sensorY, $beaconX, $beaconY] = $line;
        $currSensorRadius = abs($sensorX - $beaconX) + abs($sensorY - $beaconY);
        $currRange = getRangeOfOverlapWithRow(2000000, $sensorX, $sensorY, $currSensorRadius);
        if (count($currRange) > 0) {
            array_push($ranges, $currRange);
        }
    }

    // this is really bad code i should really look up how to build ranges properly
    function combineRanges(array $ranges): array {
        $finalRanges = [];
        foreach($ranges as $range) {
            [$left, $right] = $range;
            for ($i = 0; $i < count($finalRanges); $i++) { 
                [$currLeft, $currRight] = $finalRanges[$i];
                if ($right > $currRight && $left <= $currRight) {
                    $finalRanges[$i][0] = min($left, $currLeft);
                    $finalRanges[$i][1] = $right;
                    continue 2;
                } else if ($left < $currLeft && $right >= $currLeft) {
                    $finalRanges[$i][0] = $left;
                    $finalRanges[$i][1] = max($right, $currRight);
                    continue 2;
                } else if ($left <= $currLeft && $right >= $currRight) {
                    $finalRanges[$i][0] = $left;
                    $finalRanges[$i][1] = $right;
                    continue 2;
                } else if ($left >= $currLeft && $right <= $currRight) {
                    continue 2;
                }
            }
            array_push($finalRanges, [$left, $right]);
        }

        return $finalRanges;
    }

    while (count($ranges) !== count(combineRanges($ranges))) {
        $ranges = combineRanges($ranges);
    }
    
    $result = array_reduce($ranges, function($acc, $arr) {
        $acc += $arr[1] - $arr[0];
        return $acc;
    }, 0);

    echo $result;
?>