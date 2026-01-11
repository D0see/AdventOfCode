<?php
    declare(strict_types=1);
    ini_set('memory_limit', '-1');

    //input parsing
    $inputArr = [];
    $fh = fopen('adventOfCode11Input.txt','r');
    while ($line = fgets($fh)) {
        $line = array_filter(preg_split('(\s|:\s)', trim($line)));
        array_push($inputArr, $line);
    }
    fclose($fh);

    // PART 1

    //here we build the map

    $map = [];

    foreach ($inputArr as $device) {
        $tag = $device[0];
        $links = array_slice($device, 1);

        $map[$tag] = $links;
    }

    function countPathToEnd(array &$map, string $currTag, string $end, array &$connectionsToEndMap = []): array {

        $result = 0; 

        if (isset($connectionsToEndMap[$currTag])) {
            return [$connectionsToEndMap[$currTag], $connectionsToEndMap];
        }

        foreach ($map[$currTag] as $tag) {

            if ($tag === $end) {
                $result++;
                continue;
            } else if ($tag === 'out') continue;

            $result += countPathToEnd($map, $tag, $end, $connectionsToEndMap)[0];
        }

        $connectionsToEndMap[$currTag] = $result;

        return [$result, $connectionsToEndMap];

    }

    if (isset($map['you'])) echo countPathToEnd($map, 'you', 'out')[0] . '<br>';

    // PART 2

    $svrToFtt = countPathToEnd($map, 'svr', 'fft')[0];
    $fftToDac = countPathToEnd($map, 'fft', 'dac')[0];
    $dacToOut = countPathToEnd($map, 'dac', 'out')[0];
    
    echo $svrToFtt * $fftToDac * $dacToOut;

?>

