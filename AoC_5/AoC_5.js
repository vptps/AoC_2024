const input = await Deno.readTextFile("input")

const lines = input.split(/\r?\n/).slice(0, -1);

const orderingRules = lines.slice(0, lines.indexOf(''));
const updates = lines.slice(lines.indexOf('') + 1);

console.log(lines, orderingRules, updates);
