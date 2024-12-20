
const input = await Deno.readTextFile("input")

const lines = input.split(/\r?\n/).slice(0, -1);

let pointer = 0;
let A = +lines[0].split(": ")[1];
let B = +lines[1].split(": ")[1];
let C = +lines[2].split
let program = lines[4].split(": ")[1].split(',').map(Number);

let instructions = [
  {
    name: "adv",
    do: (operand) => {
      A = parseInt(A / Math.pow(2,getComboOperand(operand)), 10);
    },
  },
  {
    name: "bxl",
    do: (operand) => {
      B = B ^ operand;
    },
  },
  {
    name: "bst",
    do: (operand) => {
      B = getComboOperand(operand) % 8;
    }
  },
  {
    name: "jnz",
    do: (operand) => {
      if (A === 0)
        return false;
      pointer = operand; // TODO: gerer le fait de ne pas incrementer pointer
      return true;
    },
  },
  {
    name: "bxc",
    do: (operand) => {
      B = B ^ C;
    }
  },
  {
    name: "out",
    do: (operand) => {
      const val = getComboOperand(operand) % 8;
      return val;
    },
  },
  {
    name: "bdv",
    do: (operand) => {
      B = parseInt(A / Math.pow(2,getComboOperand(operand)), 10);
    },
  },
  {
    name: "cdv",
    do: (operand) => {
      C = parseInt(A / Math.pow(2,getComboOperand(operand)), 10);
    },
  },
];

const getComboOperand = (operand) => {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand;
    case 4:
      return A;
    case 5:
      return B;
    case 6:
      return C;
    case 7:
      console.log('ERROR, il devrait pas y avoir de 7');
      return 0;
    default:
      return 0;
  }
};

const getOutput = (Aarg = undefined) => {
  // initialize
  let output = '';
  pointer = 0;
  A = Aarg ? Aarg : +lines[0].split(": ")[1];
  B = +lines[1].split(": ")[1];
  C = +lines[2].split(": ")[1];
  program = lines[4].split(": ")[1].split(',').map(Number);

  // console.log(A, B, C, pointer, program);

  while (pointer < program.length) {
    let instruction = program[pointer];
    let operand = program[pointer + 1];
    // console.log('Pointer at: ', pointer, 'Operation Name: ', instruction.name, 'Operand: ', operand);
    let operationResult = instructions[instruction].do(operand);

    // console.log(operationResult);
    if (typeof operationResult === 'number') {
      output += '' + operationResult + ',';
    }

    if (operationResult !== true) { // for operation jnz, we dont increment pointer
      pointer += 2;
    }
  }

  return output.slice(0, -1);
}

console.log(getOutput());

// part 2
let res = '';
let expectedResult = program.join(',');
let ACounter = 5000000000;

console.log('expected result = ', expectedResult);

while (res !== expectedResult) {
  res = getOutput(ACounter++);

  if (ACounter % 10000 === 0) {
    console.log(ACounter, res);
  }
}

console.log(ACounter);
