const input = await Deno.readTextFile("input")

const lines = input.split(/\r?\n/).slice(0, -1);
const XMAS = 'XMAS';
let xmasCount = 0;
let masCount = 0;

const lookTop = (xmasIndex, y, x) => {
  if (y - (XMAS.length - xmasIndex) < 0) { // make sure we don't get out of bounds
    return 0;
  }
  if (lines[y - 1][x] === XMAS[xmasIndex] && xmasIndex === XMAS.length-1) {
    return 1;
  }
  if (lines[y - 1][x] === XMAS[xmasIndex]) {
    return lookTop(xmasIndex + 1, y - 1, x);
  }
  return 0;
}

const lookDown = (xmasIndex, y, x) => {
  if (y + (XMAS.length - xmasIndex) > lines.length - 1) { // make sure we don't get out of bounds
    return 0;
  }
  if (lines[y + 1][x] === XMAS[xmasIndex] && xmasIndex === XMAS.length-1) {
    return 1;
  }
  if (lines[y + 1][x] === XMAS[xmasIndex]) {
    return lookDown(xmasIndex + 1, y + 1, x);
  }
  return 0;
}

const lookLeft = (xmasIndex, y, x) => {
  if (x - (XMAS.length - xmasIndex) < 0) { // make sure we don't get out of bounds
    return 0;
  }
  if (lines[y][x - 1] === XMAS[xmasIndex] && xmasIndex === XMAS.length-1) {
    return 1;
  }
  if (lines[y][x - 1] === XMAS[xmasIndex]) {
    return lookLeft(xmasIndex + 1, y, x - 1);
  }
  return 0;
}

const lookRight = (xmasIndex, y, x) => {
  if (x + (XMAS.length - xmasIndex) > lines[y].length) { // make sure we don't get out of bounds
    return 0;
  }
  if (lines[y][x + 1] === XMAS[xmasIndex] && xmasIndex === XMAS.length-1) {
    return 1;
  }
  if (lines[y][x + 1] === XMAS[xmasIndex]) {
    return lookRight(xmasIndex + 1, y, x + 1);
  }
  return 0;
}

const lookTopLeft = (xmasIndex, y, x) => {
  if (y - (XMAS.length - xmasIndex) < 0 || x - (XMAS.length - xmasIndex) < 0) { // make sure we don't get out of bounds
    return 0;
  }
  if (lines[y - 1][x - 1] === XMAS[xmasIndex] && xmasIndex === XMAS.length-1) {
    return 1;
  }
  if (lines[y - 1][x - 1] === XMAS[xmasIndex]) {
    return lookTopLeft(xmasIndex + 1, y - 1, x - 1);
  }
  return 0;
}

const lookTopRight = (xmasIndex, y, x) => {
  if (y - (XMAS.length - xmasIndex) < 0 || x + (XMAS.length - xmasIndex) > lines[y].length) { // make sure we don't get out of bounds
    return 0;
  }
  if (lines[y - 1][x + 1] === XMAS[xmasIndex] && xmasIndex === XMAS.length-1) {
    return 1;
  }
  if (lines[y - 1][x + 1] === XMAS[xmasIndex]) {
    return lookTopRight(xmasIndex + 1, y - 1, x + 1);
  }
  return 0;
}

const lookDownLeft = (xmasIndex, y, x) => {
  if (y + (XMAS.length - xmasIndex) > lines.length - 1 || x - (XMAS.length - xmasIndex) < 0) { // make sure we don't get out of bounds
    return 0;
  }
  if (lines[y + 1][x - 1] === XMAS[xmasIndex] && xmasIndex === XMAS.length-1) {
    return 1;
  }
  if (lines[y + 1][x - 1] === XMAS[xmasIndex]) {
    return lookDownLeft(xmasIndex + 1, y + 1, x - 1);
  }
  return 0;
}

const lookDownRight = (xmasIndex, y, x) => {
  if (y + (XMAS.length - xmasIndex) > lines.length - 1 || x + (XMAS.length - xmasIndex) > lines[y].length) { // make sure we don't get out of bounds
    return 0;
  }
  if (lines[y + 1][x + 1] === XMAS[xmasIndex] && xmasIndex === XMAS.length-1) {
    return 1;
  }
  if (lines[y + 1][x + 1] === XMAS[xmasIndex]) {
    return lookDownRight(xmasIndex + 1, y + 1, x + 1);
  }
  return 0;
}

for (let i = 0; i < lines.length; i++) {
  const characters = lines[i];
  for (let j = 0; j < characters.length; j++) {
    let xmasIndex = 0;

    if (characters[j] === XMAS[xmasIndex]) { // des qu'on tombe sur un X on regarde autour de nous
      xmasCount += lookTop(xmasIndex + 1, i, j);
      xmasCount += lookDown(xmasIndex + 1, i, j);
      xmasCount += lookLeft(xmasIndex + 1, i, j);
      xmasCount += lookRight(xmasIndex + 1, i, j);
      xmasCount += lookTopLeft(xmasIndex + 1, i, j);
      xmasCount += lookTopRight(xmasIndex + 1, i, j);
      xmasCount += lookDownLeft(xmasIndex + 1, i, j);
      xmasCount += lookDownRight(xmasIndex + 1, i, j);
    }
  }
}

for (let i = 1; i < lines.length - 1; i++) { // +1 and -1 to avoid out of bounds
  const characters = lines[i];
  for (let j = 1; j < characters.length - 1; j++) {
    if (characters[j] === 'A') {
      // console.log('ON EST SUR LE A EN POSITION', i, j);
      // console.log(lines[i - 1][j - 1] === 'M' && lines[i - 1][j + 1] === 'M' && // M on top
      //   lines[i + 1][j - 1] === 'S' && lines[i + 1][j + 1] === 'S'
      // )
      // console.log(lines[i - 1][j - 1] ,lines[i + 1][j - 1] ,// M on left
      //   lines[i + 1][j + 1], lines[i - 1][j + 1] 
      // )
      // console.log(lines[i - 1][j + 1] === 'M' && lines[i + 1][j + 1] === 'M' && // M on right
      //   lines[i + 1][j - 1] === 'S' && lines[i - 1][j - 1] === 'S'
      // )
      // console.log(lines[i + 1][j - 1] === 'M' && lines[i + 1][j + 1] === 'M' && // M on bottom
      //   lines[i - 1][j + 1] === 'S' && lines[i - 1][j - 1] === 'S'
      // )
      if (
        lines[i - 1][j - 1] === 'M' && lines[i - 1][j + 1] === 'M' && // M on top
        lines[i + 1][j - 1] === 'S' && lines[i + 1][j + 1] === 'S' ||
        lines[i - 1][j - 1] === 'M' && lines[i + 1][j - 1] === 'M' && // M on left
        lines[i + 1][j + 1] === 'S' && lines[i - 1][j + 1] === 'S' ||
        lines[i - 1][j + 1] === 'M' && lines[i + 1][j + 1] === 'M' && // M on right
        lines[i + 1][j - 1] === 'S' && lines[i - 1][j - 1] === 'S' ||
        lines[i + 1][j - 1] === 'M' && lines[i + 1][j + 1] === 'M' && // M on bottom
        lines[i - 1][j + 1] === 'S' && lines[i - 1][j - 1] === 'S'
      ) {
        masCount++;
      }
    }
  }
}

console.log(xmasCount, masCount);
