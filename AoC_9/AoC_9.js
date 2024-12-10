const input = await Deno.readTextFile("input");

const line = input.split('');

const fixChar = (i) => {
  if (blocks[endOfBlocksPointer] !== '.') {
    blocks[i] = blocks[endOfBlocksPointer];
    blocks[endOfBlocksPointer] = '.';
    endOfBlocksPointer--;
  } else {
    endOfBlocksPointer--;
    fixChar(i);
  }
}

let files = [];
let emptySpace = [];
let blocks = [];
let disk = [];

for (let i = 0; i < line.length; i++) {
  if (i % 2 === 0) {
    files.push({
      id: i / 2,
      size: +line[i]
    });
    disk.push({
      id: i / 2,
      size: +line[i]
    });

    for (let j = 0; j < +line[i]; j++) {
      blocks.push(i / 2);
    }
  } else {
    emptySpace.push({
      size: +line[i]
    });
    disk.push({
      size: +line[i]
    });

    for (let j = 0; j < +line[i]; j++) {
      blocks.push('.');
    }
  }
}

let blocks2 = blocks.slice();

// part 1
let endOfBlocksPointer = blocks.length - 1; // un index en bout de tableau
let wasLastCharToFix = false;
let checksum = 0;

for (let i = 0; i < blocks.length && !wasLastCharToFix; i++) {
  if (blocks[i] === '.') {
    fixChar(i);
  }
  wasLastCharToFix = !blocks.slice(i + 1).some(char => char !== '.'); // on s'arrete quand il ne reste que des '.'
}

let newArray = blocks.slice(0, blocks.indexOf('.'));
for (let i = 0; i < newArray.length; i++) {
  checksum += +newArray[i] * i;
}

console.log(checksum);

// part 2
const fixDisk = (emptyIndex, i) => {
  if (emptyIndex === -1) {
    return;
  }

  if (disk[i].size <= disk[emptyIndex].size) {
    let elt = disk[i];
    disk[emptyIndex].size -= disk[i].size;

    if (disk[emptyIndex].size === 0) {
      disk.splice(emptyIndex, 1); // space is not empty anymore, remove this entry
    }

    disk.splice(emptyIndex, 0, elt); // files[i] -> on sort le dernier file et on le met à la place de l'emptySpace
    disk.splice(disk.findLastIndex(d => d.id === elt.id), 1, { size: elt.size });
  } else {
    fixDisk(disk.findIndex((elt, index) => elt.id === undefined && index > emptyIndex), i);
  }
}

let checksum2 = 0;
const maxId = Math.max(...disk.map(elt => elt.id).filter(elt => elt !== undefined));
let currentId = maxId;

while (currentId >= 0) {
  let i = disk.findIndex(elt => elt.id === currentId); // index of the file we want to move
  let emptyIndex = disk.findIndex((elt) => elt.id === undefined); // find first empty space

  if (emptyIndex > i) {
    currentId--;
    continue;
  }

  if (disk[i].id === undefined) { // on est sur un espace vide, on ne fait rien
    continue;
  } else {
    fixDisk(emptyIndex, i);
  }

  currentId--;
}

let mergedString = disk.map(elt => {
  let stringToreturn = '';
  if (elt.id === undefined) {
    for (let j = 0; j < elt.size; j++) {
      stringToreturn += '.';
    }
  } else {
    for (let j = 0; j < elt.size; j++) {
      stringToreturn += elt.id;
    }
  }

  return stringToreturn;
});

mergedString = mergedString.join('');

for (let i = 0; i < mergedString.length; i++) {
  if (mergedString[i] !== '.') {
    checksum2 += +mergedString[i] * i;
  }
}

console.log(checksum2);
