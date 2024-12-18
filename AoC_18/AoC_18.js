import { Node } from './modules/node.js';
import { showSolution, getNodeNeighbours, getDistance,compareNodes } from './modules/utils.js';

const input = await Deno.readTextFile("input")

const lines = input.split(/\r?\n/).slice(0, -1);

const gridSize = 71; // 6 for tests, 70 for part 1
const fallenBytes = 1024; // 12 for tests, 1024 fro part 1

const initGrid = () => Array.from({ length: gridSize }, () => Array.from({length: gridSize }, () => '.')); // init two dimensions array

const AStar = () => {
  const start = new Node(0, 0, 0, 0, true, undefined);
  const end =new Node(gridSize - 1, gridSize - 1, 0, 0, true, undefined)

  // Start A* algorithm
  const closedList = [];
  const openList = [];
  openList.push(start);

  while (openList.length > 0) {
    let u = openList.pop();
    grid[u.y][u.x] = 'X';
    if (u.x === end.x && u.y === end.y) {
      count = showSolution(u, grid);
      break;
    }

    const neighbours = getNodeNeighbours(u, nodeList);
    neighbours.forEach(v => {
      if (!v.traversable) {
        closedList.push(v);
      }

      if (!(closedList.includes(v) || (openList.includes(v) && v.cost < u.cost + 1))) {
        v.parent = u;
        v.cost = u.cost + 1;
        v.heuristique = v.cost + getDistance(v, end);
        if (openList.includes(v)) {
          const idx = openList.indexOf(v);
          openList.splice(idx, 1);
        }
        openList.push(v);
         openList.sort(compareNodes);
      }
    })

    closedList.push(u);
    grid[u.y][u.x] = '.';
  }
}

const displaySolution = () => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      nodeList.push(new Node(j, i, 0, 0, grid[i][j] === '.', undefined));
    }
  }
  
  // then use A* algo to find shortest path
  AStar();
  
  // console.log();
  // console.log(grid.map(row => row.join('')).join('\n')); // map with path displayed

  return count;
}

// part 1
let grid = initGrid();
let nodeList = [];
let count = 0;

// bytes falling
for (let i = 0; i < lines.length; i++) {
  let line = lines[i].split(',');
  let [x, y] = line.map(Number);
  grid[y][x] = '#';

  if (i === fallenBytes - 1) {
    break;
  }
}

// console.log(grid.map(row => row.join('')).join('\n')); // map when bytes have fallen

console.log(displaySolution());

// part 2
let res = 1;
let nbLine = fallenBytes; // we know from 0 to fallenBytes it works
// check aStar result after every fallenBytes, until showSolution returns 0 meaning there is no path
while (res !== 0) {
  grid = initGrid();
  nodeList = [];
  count = 0;
  nbLine++;

  for (let c = 0; c < nbLine; c++) {
    // make bytes fall
    let line = lines[c].split(',');
    let [x, y] = line.map(Number);
    grid[y][x] = '#';
  }

  console.log('calculating for line ' + nbLine);
  res = displaySolution();
}
// NB: on peut optimiser en commencant à nbLine = le prochain après la 1024e ligne qui contient des coordonées incluses dans grid.filter(<les cases avec un 'O'>)

console.log(lines[nbLine - 1]);
