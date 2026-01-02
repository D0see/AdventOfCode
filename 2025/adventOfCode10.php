<?php
    declare(strict_types=1);
    ini_set('memory_limit', '8G');


    //builds usable machine representations 
    // -> array of desired end state (bool array)
    // -> followed by array of array of button (int arrays)
    // -> followed by array of voltages (int array)
    // [
    //  endstate => [],
    //  buttons => [
    //       []...,[]
    //  ],
    //  voltages => []
    // ]
    function getFormattedMachineArr(array $rawInput) {
        $formattedInput = [];
        $formattedInput['endState'] = '';
        $formattedInput['buttons'] = [];

        foreach (array_slice(str_split($rawInput[0]), 1, strlen($rawInput[0]) - 2) as $char) {
            $formattedInput['endState'] .= $char === '#' ? '1' : 0;
        }

        for ($i = 1; $i <= count($rawInput) - 2; $i++) {
            $formattedButton = array_map(fn($e) => (int) $e, array_fill_keys(array_filter(preg_split('(\\(|,|\\))', $rawInput[$i]), fn($e) => $e !== ''), true));
            $formattedInput['buttons'][] = $formattedButton;
        }

        $formattedVoltage = array_map(fn($e) => (int) $e, array_values(array_filter(preg_split('(\\{|,|\\})', $rawInput[count($rawInput) - 1]), fn($e) => $e !== '')));
        $formattedInput['voltages'] = $formattedVoltage;
        
        return $formattedInput;
    }

    //input parsing
    $machines = [];
    $fh = fopen('adventOfCode10Input.txt','r');
    while ($machineStr = fgets($fh)) {
        array_push($machines, getFormattedMachineArr(explode(' ', trim($machineStr))));
    }
    fclose($fh);

    // PART 1

    // execution takes a little over the default 600 secondes limit on my machine

    // for this part im guessing we need to do something like a bfs where each button is a node in a graph that has all buttons 
    // as its direct childrens :
    // we keep track of the current state of the machine and number of presses we are currently on in the branch we are traversing
    // and once the current state matches the expected endstate we return the number of press it took to get there
    // we can optimize using memo to filter already encountered states

    //method used to append next button press options to the queue, including the current state and number of presses
    function appendOptionsToQueue(array &$queue, array $buttons, string $state, int $presses): array {
        $datas = array_map(fn($button) => [
                'button' => $button, 
                'state' => $state, 
                'presses' => $presses
            ], 
            $buttons
        );  

        array_push($queue, ...$datas);
        
        return $queue;
    }

    //method used to determine in which state the machine is going to be after a button press
    function calcNextState(array $button, string $state): string {
        $nextState = '';
        for ($i = 0; $i < strlen($state); $i++) {
            if (isset($button[$i])) $nextState .= $state[$i] === '1' ? '0' : '1';
            else $nextState .= $state[$i];
        }
        return $nextState;
    }

    //BFS search to find the fewest button presses needed to go from base state to endstate 
    function getFewestNeededPresses(string $endState, array $buttons, array $queue): int {

        //we memoize encoutered states as to not repeat useless calculations
        $memo = [];

        while(count($queue) > 0) {
            ['button' => $button, 'state' => $state, 'presses' => $presses] = array_shift($queue);

            $nextState = calcNextState($button, $state);

            if (isset($memo[$nextState])) continue;
            if ($nextState === $endState) return $presses;

            // todo remove the button from the list of buttons i pass here
            $buttonsToPass = array_filter($buttons, fn($btn) => $btn !== $button);
            $queue = appendOptionsToQueue($queue, $buttons, $nextState, $presses + 1);

            $memo[$state] = true;
            
        }        
    }

    $result = 0;

    foreach($machines as ['endState' => $endState, 'buttons' => $buttons, 'voltages' => $voltages]) {
        $initialState = implode(array_fill(0, strlen($endState), '0'));

        $queue = [];
        $queue = appendOptionsToQueue($queue, $buttons, $initialState, 1);

        $result += getFewestNeededPresses($endState, $buttons, $queue);
    }

    echo json_encode($result);