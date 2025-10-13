<?php
    declare(strict_types=1);

    //input parsing
    $fh = fopen('adventOfCode10Input.txt','r');
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

    // the queue should be a linked list for efficiency but who has time for this ?.... ok im doing it
    // actually no i could just push the last instructions first and pop my way back down

    $queue = [];
    for ($i = count($orders) - 1; $i >= 0; $i--) {
        if ($orders[$i][0] === "addx") {
            array_push($orders[$i], 2);
        }
        array_push($queue, $orders[$i]);
    }

    $cycle = 1;
    $currX = 1;
    $cycleToRegister = [220, 180, 140, 100, 60, 20];
    $result = 0;
    while(count($queue) > 0 && count($cycleToRegister) > 0) {

        $currCycleToRegister = $cycleToRegister[count($cycleToRegister) - 1];
        if ($currCycleToRegister === $cycle) {
            $result += $currX * $cycle;
            array_pop($cycleToRegister);
        }

        $currOrder = $queue[count($queue) - 1];

        if ($currOrder[0] === "noop") {
            array_pop($queue);
        } else if ($currOrder[0] === "addx") {
            if ($currOrder[2] === 1) {
                $currX += (int) $currOrder[1];
                array_pop($queue);
            } else {
                $queue[count($queue) - 1][2]--;
            }
        }
        $cycle++;
    }

    echo $result;
    echo "<br>";

    //PART 2

    $queue = [];
    for ($i = count($orders) - 1; $i >= 0; $i--) {
        if ($orders[$i][0] === "addx") {
            array_push($orders[$i], 2);
        }
        array_push($queue, $orders[$i]);
    }

    $cycle = 0;
    $currX = 1;
    $pixels = [];
    $screenWidth = 40;
    while(count($queue) > 0) {
        array_push($pixels, abs($currX - ($cycle % $screenWidth)) <= 1 ? 'X' : 'O');
        $currOrder = $queue[count($queue) - 1];

        if ($currOrder[0] === "noop") {
            array_pop($queue);
        } else if ($currOrder[0] === "addx") {
            if ($currOrder[2] === 1) {
                $currX += (int) $currOrder[1];
                array_pop($queue);
            } else {
                $queue[count($queue) - 1][2]--;
            }
        }
        $cycle++;
    }

    for ($i = 0; $i < count($pixels) / $screenWidth; $i+= 1) {
        echo json_encode(array_slice($pixels, $i * $screenWidth, $screenWidth));
        echo '<br>';
    }
?>