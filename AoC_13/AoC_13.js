import * as mathjs from "https://dev.jspm.io/mathjs";

const math = mathjs;

const input = await Deno.readTextFile("input")

const lines = input.split(/\r?\n/).slice(0, -1);
const machines = [];
let sum1 = 0;
let sum2 = 0;

const formatMachine = (lineIndex) => {
  const regex = /\d+/g;
  const aMatches = lines[lineIndex].match(regex);
  const bMatches = lines[lineIndex + 1].match(regex);
  const prizeMatches = lines[lineIndex + 2].match(regex);
  const A = { X: +aMatches[0], Y: +aMatches[1]};
  const B = { X: +bMatches[0], Y: +bMatches[1]};
  const prize = { X: +prizeMatches[0], Y: +prizeMatches[1]};

  return { A, B, prize };
}

const testMachine = (machine, isPart2) => { // never pass isPart2 as true, or this will take forever
  const { A, B, prize } = machine;
  if (isPart2) {
    prize.X = prize.X + 10000000000000;
    prize.Y = prize.Y + 10000000000000;
  }
  let [currentX, currentY] = [0, 0];
  let currentCost = isPart2 ? Infinity : 500;
  let pressLimit = isPart2 ? 100000000000000 : 100;

  // i * A.X + j * B.X = prize.X
  // i * A.Y + j * B.Y = prize.Y
  for (let i = 0; i <= pressLimit; i++) { // we are limited to 100 press per button
    for (let j = 0; j <= pressLimit; j++) {
      currentX = A.X * i + B.X * j;
      currentY = A.Y * i + B.Y * j;

      if (currentX === prize.X && currentY === prize.Y) {
        currentCost = Math.min(currentCost, i * 3 + j);
      }
    }
  }

  return currentCost === 500 ? 0 : currentCost;
}

const testMachinePart2 = (machine) => {
  const { A, B, prize } = machine;

  prize.X = math.add(prize.X, 10000000000000); // Adjust prize.X by a large number
  prize.Y = math.add(prize.Y, 10000000000000); // Adjust prize.Y by a large number

  // A.X * nA + B.X * nB = prize.X
  // A.Y * nA + B.Y * nB = prize.Y

  // on va exprimer nB en fonction de nA pour n'avoir plus que nA
  // B.Y * (A.X * nA + B.X * nB)  = B.Y * prize.X
  // B.X * (A.Y * nA + B.Y * nB) = B.X * prize.Y

  // on multiplie la première par B.Y, et la deuxieme par B.X
  // B.Y * A.X * nA + B.Y * B.X * nB  = B.Y * prize.X
  // B.X * A.Y * nA + B.X * B.Y * nB = B.X * prize.Y

  // on soustrait la premiere equation à la 2e et inversement
  // B.Y * A.X * nA + B.Y * B.X * nB - B.X * A.Y * nA + B.X * B.Y * nB = B.Y * prize.X - B.X * prize.Y
  // B.X * A.Y * nA + B.X * B.Y * nB - B.Y * A.X * nA + B.Y * B.X * nB = B.X * prize.Y - B.Y * prize.X

  // ca vire B.Y * B.X * nB de la 1e et de la 2e
  // B.Y * A.X * nA - B.X * A.Y * nA = B.Y * prize.X - B.X * prize.Y
  // B.X * A.Y * nA - B.Y * A.X * nA = B.X * prize.Y - B.Y * prize.X

  // on n'a plus qu'une inconnue: nA (le nombre de pression sur A)
  // nA = (B.Y * prize.X - B.X * prize.Y) / (B.Y * A.X - B.X * A.Y)
  
  // a cause de JS on ne peut pas faire ça directement
  // let nA = (BigInt(B.Y) * prize.X - BigInt(B.X) * prize.Y) / BigInt(B.Y * A.X - B.X * A.Y);

  // à la place, on va checker que nominateur % denomiateur === 0
  let naNominator = math.subtract(math.multiply(B.Y, prize.X), math.multiply(B.X, prize.Y));
  let naDenominator = math.subtract(math.multiply(B.Y, A.X), math.multiply(B.X, A.Y));

  // Check if the nominator is divisible by the denominator
  if (math.mod(naNominator, naDenominator) === 0) { // un nombre de pression est un entier
    let nA = math.divide(naNominator, naDenominator);

    // pour nb, on remplace juste nA par la valeur dans une des equations précédentes
    // par exemple: nB = (prize.X - A.X * nA) / B.X en prenant la première
    // let nB = (BigInt(prize.X) - BigInt(A.X) * nA) / BigInt(B.X);
    let nbNominator = math.subtract(prize.X, math.multiply(A.X, nA));

    if (math.mod(nbNominator, B.X) === 0) {
      let nB = math.divide(nbNominator, B.X);
      return math.add(math.multiply(nA, 3), nB); // Return nA * 3 + nB
    }

    return 0;
  }

  return 0;
};

for (let i = 0; i < lines.length; i += 4) {
  machines.push(formatMachine(i));
}

for (const machine of machines) {
  // on pourrait (devrait ?) utiliser la fonction de la partie 2,
  // mais pour l'histoire on garde la brute force de la première ;)
  sum1 += testMachine(machine, false);
  sum2 += testMachinePart2(machine);
}

console.log(sum1, sum2);
