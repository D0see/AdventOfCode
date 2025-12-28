<?php
    declare(strict_types=1);

    //input parsing
    $ranges = [];
    $values = [];
    $crossedSplit = false;

    $fh = fopen('adventOfCode5Input.txt','r');
    while ($line = fgets($fh)) {
        $line = (trim($line));
        if ($line === '') {
            $crossedSplit = true;
            continue;
        }
        $crossedSplit ? array_push($values, $line) : array_push($ranges, $line);
    }
    fclose($fh);

    $values = array_map(fn($value) => (int) $value, $values);

    $ranges = array_map(fn($range) => array_map(fn($limit) => (int) $limit,explode('-',$range)), $ranges);

    //sort here so i can be lazy with range merging
    usort($ranges, fn($a, $b) => $a[0] > $b[0]);

    //here we merge the ranges (idk if this is going to be useful but i might need it for part 2)
    $mergedRanges = [];

    foreach ($ranges as [$rangeStart, $rangeEnd]) {

        for ($i = 0; $i < count($mergedRanges); $i++) {

            [$mergedRangeStart, $mergedRangeEnd] = $mergedRanges[$i];

            if ($rangeStart <= $mergedRangeEnd && $rangeEnd >= $mergedRangeStart) {
                $mergedRanges[$i][0] = min($rangeStart, $mergedRangeStart);
                $mergedRanges[$i][1] = max($rangeEnd, $mergedRangeEnd);
                continue 2;
            }
        }

        array_push($mergedRanges, [$rangeStart, $rangeEnd]);

    }

    // PART 1

    $result = 0;

    function valueInRanges(array $ranges, int $value) {
        foreach ($ranges as [$start, $end]) {
            if ($value >= $start && $value <= $end) return true;
        }
        return false;
    }

    foreach ($values as $value) {
        if (valueInRanges($mergedRanges, $value)) $result++;
    }

    echo $result;

    echo '<br>';

    // PART 2 (wow shocker i did need to merge the ranges)

    $result = array_reduce($mergedRanges, fn($acc, $range) => $acc + $range[1] - $range[0] + 1, 0);

    echo $result; 
