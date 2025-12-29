<?php
    declare(strict_types=1);

    /** @var Node[] */
    $nodes = [];

    //input parsing
    $lineCount = 0;
    $fh = fopen('adventOfCode8Input.txt','r');
    while ($line = fgets($fh)) {
        $arr = array_map(fn($str) => (int) $str, explode(',', trim($line)));
        $lineCount++;
        array_push($nodes, new Node($lineCount - 1, ...$arr));
    }
    fclose($fh);

    // PART 1

    class Edge {
        public Node $start;
        public Node $end;
        public float $length;

        public function __construct($start, $end, $length) {
            $this->start = $start;
            $this->end = $end;
            $this->length = $length;
        }
    }

    class Node {
        public int $index;
        public int $x;
        public int $y;
        public int $z;
        /** @var Edge[] */
        public array $edges;

        public function __construct($index, $x, $y, $z) {
            $this->index = $index;
            $this->x = $x;
            $this->y = $y;
            $this->z = $z;
            $this->edges = [];
        }
    }

    //helper method to calculate distance between 2 nodes in 3d space
    function calclength3d (Node $node1, Node $node2): float {
        return sqrt(
            ($node1->x - $node2->x) ** 2 + 
            ($node1->y - $node2->y) ** 2 + 
            ($node1->z - $node2->z) ** 2
        );
    }

    //recursive way to traverse a graph and count the number of nodes in a graph
    function getConnexionSize(Node $node, array &$visitedNodes, $currResult = 0): int {
        $visitedNodes[$node->index] = true;
        $currResult++;
        foreach ($node->edges as $edge) {
            if (isset($visitedNodes[$edge->end->index])) continue;
            $currResult += getConnexionSize($edge->end, $visitedNodes);
        }
        return $currResult;

    }

    /** @var Edge[] */
    $edges = [];

    //get all edges in the graph
    foreach ($nodes as $index => $node) {
        for($i = $index + 1; $i < count($nodes); $i++) {
            array_push($edges, new Edge($node, $nodes[$i], calclength3d($node, $nodes[$i])));
        }
    }

    //sort the edges by length
    usort($edges, fn(Edge $a, Edge $b) => $a->length - $b->length);

    //build graph with shortest x edges
    for ($i = 0; $i < $lineCount; $i++) {

        /** @var Edge */
        $currEdge = $edges[$i];

        $nodes[$currEdge->start->index]->edges[] = new Edge($currEdge->start, $currEdge->end, $currEdge->length);
        $nodes[$currEdge->end->index]->edges[] = new Edge($currEdge->end, $currEdge->start, $currEdge->length);
    }

    //count the number of nodes in every connexions
    $linkSizes = [];
    $visitedNodes = [];
    foreach ($nodes as $index => $node) {
        if (!isset($visitedNodes[$index])) array_push($linkSizes, getConnexionSize($node, $visitedNodes));
    }
    
    //sort connexion sizes by height desc
    usort($linkSizes, fn(int $a, int $b) => $b - $a);

    //mulitply the 3 biggest connexion together
    $result = array_reduce(array_slice($linkSizes, 0, 3), fn($acc, $val) => $acc * $val, 1);

    echo $result;
    echo '<br>';

    //PART 2

    $linked = [];

    $counter = 0;
    while (true) {

        /** @var Edge */
        $currEdge = $edges[$counter];

        $linked[$currEdge->start->index] = true;
        $linked[$currEdge->end->index] = true;
        
        if (count($linked) === $lineCount) {
            echo $currEdge->start->x * $currEdge->end->x;
            break;
        }
        
        $counter++;
    }