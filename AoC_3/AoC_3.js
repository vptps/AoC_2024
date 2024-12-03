const input = await Deno.readTextFile("input")

const calculateResult = (mulMatches) => {
  let res = 0;
  for (const match of mulMatches) {
    const splittedMatch = match.split(',');
    const firstNumber = +splittedMatch[0].replace('mul(', '');
    const secondNumber = +splittedMatch[1].slice(0, -1);
  
    res += firstNumber * secondNumber;
  }

  return res;
};

const regexp = /mul\(\d{1,3},\d{1,3}\)/g;
let firstResult = 0;
let secondResult = 0;

const matches = input.match(regexp);
firstResult = calculateResult(matches);

// using regexp because duh
const regexpToRemoveDontParts = /(don't\(\)){1}.*?(do\(\)){1}/gusm;
// remove everything between don't() and do()
let modifiedInput = input.split(/\r?\n/).join('').replaceAll(regexpToRemoveDontParts, '');
const dontIndex = modifiedInput.indexOf('don\'t()');
modifiedInput = modifiedInput.slice(0, dontIndex);

// keeping this as proof of previous failed attempt :')
// let stop = false;
// let copiedInput = input
// let modifiedInput = '';
// while (!stop) {
//   let dontIndex = copiedInput.indexOf('don\'t()');
//   let doIndex = copiedInput.indexOf('do()', dontIndex + 1);

//   if (doIndex === -1) {
//     modifiedInput += copiedInput
//     stop = true;
//   } else { // removed "dont" parts of input
//     modifiedInput += copiedInput.slice(0, dontIndex);
//   }
//   copiedInput = copiedInput.slice(doIndex + 4); // the "rest" of the input after first do()
// }

const matches2 = modifiedInput.match(regexp);
secondResult = calculateResult(matches2);

console.log(firstResult, secondResult);
