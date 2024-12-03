const input = await Deno.readTextFile("input")

let sumDistance = 0;
let sumSimilarity = 0;

const lines = input.split(/\r?\n/);
const firstList = lines.map(line => +(line.split('   ')[0])).sort((a, b) => a - b);
const secondList = lines.map(line => +(line.split('   ')[1])).sort((a, b) => a - b);

for (let i = 0; i < firstList.length; i++) {
  sumDistance += Math.abs(firstList[i] - secondList[i]);

  sumSimilarity += firstList[i] * secondList.filter(e => e === firstList[i]).length;
}

console.log(sumDistance, sumSimilarity);
