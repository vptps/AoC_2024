const input = await Deno.readTextFile("input");

let lines = input.split(/\r?\n/).slice(0, -1).map(line => line.split(''));

const guardDirections = ['^', '>', 'v', '<'];
let xCount = 0;
let blockCount = 0;
let validatedBlockablePos = [];

const checkInfiniteLoop = (originalX, originalY, originalI, copiedInput) => {
  let [a, b, c] = [originalX, originalY, originalI];
  let visitedLocations = []

  switch(c) { // place potential block
    case 0: // going up
      if (copiedInput[b - 1])
        copiedInput[b - 1][a] = '#';
      else
        return false;
      break;
    case 1: // going right
      if (copiedInput[b][a + 1])
        copiedInput[b][a + 1] = '#';
      else
        return false;
      break;
    case 2: // going down
      if (copiedInput[b + 1])
        copiedInput[b + 1][a] = '#';
      else 
        return false;
      break;
    case 3: // going left
      if (copiedInput[b][a - 1])
        copiedInput[b][a - 1] = '#';
      else
        return false;
      break;
    default:
      break;
  }

  let firstTurn = true;
  let patroling2 = true;
  // console.log(copiedInput.map((line) => line.join('')).join('\n'));
  while (patroling2) {
    if (validatedBlockablePos.includes([a, b, c].toString())) { // on a deja validé ce block
      return false;
    }
    if (!firstTurn && visitedLocations.includes([a, b, c].toString())) {
      // console.log(copiedInput.map((line) => line.join('')).join('\n'));
      return true;
    }
    visitedLocations.push([a, b, c].toString());
    firstTurn = false;

    switch (c) {
      case 0: // going up
        if (copiedInput[b - 1][a] !== '#') {
          copiedInput[b - 1][a] = 'O';
          b--;
        } else {
          c++;
          justTurned = true;
        }
        if (copiedInput[b - 1] === undefined) {
          patroling2 = false;
        }
        break;
      case 1: // going right
        if (copiedInput[b][a + 1] !== '#') {
          copiedInput[b][a + 1] = 'O';
          a++;
        } else {
          c++;
          justTurned = true;
        }
        if (copiedInput[b][a + 1] === undefined) {
          patroling2 = false;
        }
        break;
      case 2: // going down
        if (copiedInput[b + 1][a] !== '#') {
          copiedInput[b + 1][a] = 'O';
          b++;
        } else {
          c++;
          justTurned = true;
        }
        if (copiedInput[b + 1] === undefined) {
          patroling2 = false;
        }
        break;
      case 3: // going left
        if (copiedInput[b][a - 1] !== '#') {
          copiedInput[b][a - 1] = 'O';
          a--;
        } else {
          c = 0;
          justTurned = true;
        }
        if (copiedInput[b][a - 1] === undefined) {
          patroling2 = false;
        }
        break;
      default:
        break;
    }
  }
  return false;
}

// get X, Y, and guard Direction
let y = lines.findIndex((line) => guardDirections.some((position) => line.includes(position)));
let x = -1;
let i = 0;
while (x === -1 && i < guardDirections.length) {
  x = lines[y].indexOf(guardDirections[i]);
  i++;
}
i--;

console.log(y, x, guardDirections[i]);

lines[y][x] = 'X';
let justTurned = false
let patroling = true;
while (patroling) {
  if (!justTurned && checkInfiniteLoop(x, y, i, lines.map(line => [...line]))) {
    blockCount++;
    validatedBlockablePos.push([x, y, i].toString());
  }

  switch (i) {
    case 0: // going up
      justTurned = false;
      if (lines[y - 1][x] !== '#') {
        lines[y - 1][x] = 'X';
        y--;
      } else {
        i++;
        justTurned = true;
      }
      if (lines[y - 1] === undefined) {
        patroling = false;
      }
      break;
    case 1: // going right
      justTurned = false;
      if (lines[y][x + 1] !== '#') {
        lines[y][x + 1] = 'X';
        x++;
      } else {
        i++;
        justTurned = true;
      }
      if (lines[y][x + 1] === undefined) {
        patroling = false;
      }
      break;
    case 2: // going down
      justTurned = false;
      if (lines[y + 1][x] !== '#') {
        lines[y + 1][x] = 'X';
        y++;
      } else {
        i++;
        justTurned = true;
      }
      if (lines[y + 1] === undefined) {
        patroling = false;
      }
      break;
    case 3: // going left
      justTurned = false;
      if (lines[y][x - 1] !== '#') {
        lines[y][x - 1] = 'X';
        x--;
      } else {
        i = 0;
        justTurned = true;
      }
      if (lines[y][x - 1] === undefined) {
        patroling = false;
      }
      break;
    default:
      break;
  }
}

console.log(lines.map((line) => line.join('')).join('\n'));

xCount = lines.reduce((acc, line) => {
  return acc + line.filter((char) => char === 'X').length;
}, 0);

console.log(xCount, blockCount);
