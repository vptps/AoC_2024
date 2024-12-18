const input = await Deno.readTextFile("input")

const lines = input.split(/\r?\n/).slice(0, -1);
const antennas = [];
let antinodes = [];
let antinodes2 = [];

const getAntinodes = (a, b) => {
  const [xDiff, yDiff] = [a.x - b.x, a.y - b.y];

  const antinodes = [
    {
      x: a.x + xDiff,
      y: a.y + yDiff
    },
    {
      x: a.x - xDiff * 2,
      y: a.y - yDiff * 2
    },
  ]

  return antinodes;
}

const getAntinodes2 = (a, b) => {
  const [xDiff, yDiff] = [a.x - b.x, a.y - b.y];
  let insideGrid = true;
  let i = 1;
  const antinodes = [a];

  while (insideGrid) {
    let a1 = {
      x: a.x + xDiff * i,
      y: a.y + yDiff * i
    };

    let a2 ={
      x: a.x - xDiff * i,
      y: a.y - yDiff * i
    };

    insideGrid = lines[a1.y]?.[a1.x] || lines[a2.y]?.[a2.x];
    if (insideGrid) {
      antinodes.push(a1);
      antinodes.push(a2);
    }

    i++;
  }

  return antinodes;
}

const removeDuplicates = (antinodes) => {
  return antinodes.filter((antinode, index) => {
    return antinodes.findIndex(a => a.x === antinode.x && a.y === antinode.y) === index;
  });
}

const removeOutOfBounds = (antinodes) => {
  return antinodes.filter((antinode) => {
    return antinode.x >= 0 && antinode.y >= 0 && antinode.x < lines[0].length && antinode.y < lines.length;
  });
}

// list antennas
for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines[i].length; j++) {
    if (lines[i][j] !== '.') {
      antennas.push({
        x: j,
        y: i,
        id: lines[i][j],
      })
    }
  }
}

const antennaSet = Object.groupBy(antennas, ({ id }) => id);

// add antinodes
for (const antennaId in antennaSet) {
  for (let i = 0; i < antennaSet[antennaId].length; i++) { // oppose every antenna to every other
    for (let j = i + 1; j < antennaSet[antennaId].length; j++) {
      antinodes.push(...getAntinodes(antennaSet[antennaId][i], antennaSet[antennaId][j]));
      antinodes2.push(...getAntinodes2(antennaSet[antennaId][i], antennaSet[antennaId][j]));
    }
  }
}

// remove duplicates
antinodes = removeDuplicates(antinodes);
antinodes2 = removeDuplicates(antinodes2);

// remove out of bounds antinodes
antinodes = removeOutOfBounds(antinodes);
antinodes2 = removeOutOfBounds(antinodes2);

console.log(antinodes.length, antinodes2.length);
