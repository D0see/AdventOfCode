<?php
    declare(strict_types=1);

    //input parsing
    $fh = fopen('adventOfCode6Input.txt','r');
    $inputString = '';
    while ($line = fgets($fh)) {
        $inputString .= $line; 
    }
    fclose($fh);

    //PART 1
    function getFirstMarkerAppearanceEndIndex(string &$inputString, int $markerLength): int {
        $markerCharacters = null;
        for ($i = 0; $i < (strlen($inputString) - $markerLength); $i++) {
            $markerCharacters = [];
            for ($j = 0; $j < $markerLength; $j++) {
                $markerCharacters[$inputString[$i + $j]] = true;
            }
            if (count($markerCharacters) === $markerLength) {
                return $i + $markerLength;
            }
        }
        return -1;
    }

    echo getFirstMarkerAppearanceEndIndex($inputString, 4);
    echo "<br>";

    //PART 2
    echo getFirstMarkerAppearanceEndIndex($inputString, 14);
?>