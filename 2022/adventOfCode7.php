<?php
    declare(strict_types=1);

    //input parsing
    $fh = fopen('adventOfCode7Input.txt','r');
    $orders = [];
    while ($line = fgets($fh)) {
        $line = preg_split('(\s|\r\n)', $line);
        $line = array_filter($line, function($elem) {
            return $elem !== '';
        });
        array_push($orders, $line);
    }
    fclose($fh);

    //PART 1

    class FolderNode {
        public string $name;
        public int $size;
        private array $childNodes; // array of FolderNode
        public FolderNode | null $parent;

        public function __construct(
            string $name, FolderNode | null $parent = null
        ) {
            $this->name = $name;
            $this->parent = $parent;
            $this->childNodes = [];
            $this->size = 0;
        }
        public function __set($property, $value) {
            if('childNodes' === $property) {
                array_push($this->childNodes, $value);
            } else {
                throw new Exception('Propriété ou valeur invalide !');
            }
        }

        public function __get($property) {
            if('childNodes' === $property) {
                return $this->childNodes;
            } else if ('name' === $property) {
                return $this->name;
            } else if ('parent' === $property) {
                return $this->parent;
            }else {
                throw new Exception('error, no property with this name');
            }
        }

        public function getChildNodeWithName(string $name): FolderNode | null {
            foreach($this->childNodes as $folder) {
                if ($folder->name === $name) return $folder;
            }
            return null;
        }
    }

    $rootFolder = new FolderNode($orders[0][2], null);

    // start by building the tree, adding the size of each file found in the root of each file
    // into the size property as we go

    $folderHead = $rootFolder;
    foreach (array_slice($orders, 1) as $order) {
        if ($order[1] === 'ls') continue;
        if ($order[1] === 'cd') {
            if ($order[2] === '..') {
                $folderHead = $folderHead->parent;
            } else {
                $folderHead = $folderHead->getChildNodeWithName($order[2]);
            }
        } else if (is_numeric($order[0])) {
            $folderHead->size += (int) $order[0];
        } else if ($order[0] === 'dir') {
            $folderHead->childNodes = new FolderNode($order[1], $folderHead);
        }
    }

    // recursively calculate the size of each folder, 
    // add the correspondant folder to the list of resultFolder

    function updateFolderSizes(FolderNode $root, int &$result) {
        foreach($root->childNodes as $folder) {
            $root->size += updateFolderSizes($folder, $result);
        }
        if ($root->size <= 100000) $result += $root->size;
        return $root->size;
    }

    $result = 0;
    updateFolderSizes($rootFolder, $result);

    echo json_encode($result);
    echo "<br>";

    // PART 2

    //70000000 - total, 30000000, needed
    $totalFolderSize = $rootFolder->size;
    $minToDelete = 30000000 - (70000000 - $totalFolderSize);
    
    
    $currBestCandidate = $rootFolder->size;
    function traverseTree($root, $minToDelete, &$currBestCandidate) {
        if ($root->size >= $minToDelete) {
            $currBestCandidate = min($root->size, $currBestCandidate);
        }
        foreach($root->childNodes as $folder) {
            traverseTree($folder, $minToDelete, $currBestCandidate);
        }
    }

    traverseTree($rootFolder, $minToDelete, $currBestCandidate);
    echo $currBestCandidate;
?>