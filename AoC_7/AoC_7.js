const input = await Deno.readTextFile("input")

const lines = input.split(/\r?\n/).slice(0, -1);
let [solution1, solution2] = [0, 0];

const checkEquation = (expectedResult, operands, currentResult, isFirstOperand, isSolution2) => {
  currentResult = +currentResult;
  if (operands.length === 0) {
    if (currentResult === expectedResult) {
      return true;
    }
    return false;
  }
  const operand = operands.shift();
  let result = false;

  if (isFirstOperand) {
    return checkEquation(expectedResult, operands.slice(), operand, false, isSolution2);
  } else {
    result = checkEquation(expectedResult, operands.slice(), currentResult + operand, false, isSolution2);
    result = result || checkEquation(expectedResult, operands.slice(), currentResult * operand, false, isSolution2);
    if (isSolution2) {
      result = result || checkEquation(expectedResult, operands.slice(), '' + currentResult + operand, false, isSolution2);
    }
    return result;
  }
}

for (let i = 0; i < lines.length; i++) {
  let line = lines[i].split(':');
  let expectedResult = +line[0];
  let operands = line[1].split(' ').toSpliced(0, 1).map(x => +x);

  solution1 += checkEquation(expectedResult, operands.slice(), 0, true, false) ? expectedResult : 0;
  solution2 += checkEquation(expectedResult, operands.slice(), 0, true, true) ? expectedResult : 0;
}

console.log(solution1, solution2);
