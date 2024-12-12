const input = await Deno.readTextFile("input")

const lines = input.split(/\r?\n/).slice(0, -1);

const rules = lines.slice(0, lines.indexOf('')).map(line => {
  const [left, right] = line.split('|').map(Number)
  return { left, right }
});
const updates = lines.slice(lines.indexOf('') + 1).map(line => line.split(',').map(elt => +elt));

// regroup all rules by left pages
const regroupRules = (rules) => {
  const result = {}

  for (const rule of rules) {
    const { left, right } = rule

    if (result[left] === undefined) {
      result[left] = new Set()
    }

    result[left].add(right)
  }

  return result
}

// validate one line of updates
const validateUpdate = (update, rulesIndex) => {
  for (let i = 0; i < update.length; i++) {
    for (let j = i + 1; j < update.length; j++) {
      const left = update[i]
      const right = update[j]

      if (!rulesIndex[left]?.has(right)) {
        return false
      }
    }
  }

  return true
}

// part 1
const regroupedRules = regroupRules(rules)

const validUpdates = updates.filter(update =>
  validateUpdate(update, regroupedRules)
)

const middlePageNumbers = validUpdates.map(line => line[Math.floor(line.length / 2)])
const result = middlePageNumbers.reduce((acc, page) => acc + page, 0);

console.log(result)

// part 2
const fixUpdate = (update, rulesIndex) => {
  return update.toSorted((a, b) => {
    if (rulesIndex[a]?.has(b)) return -1
    if (rulesIndex[b]?.has(a)) return 1
    return 0
  })
}

const invalidUpdates = updates.filter(
  update => !validateUpdate(update, regroupedRules)
)

const fixedUpdates = invalidUpdates.map(update =>
  fixUpdate(update, regroupedRules)
)

const middlePageNumbers2 = fixedUpdates.map(line => line[Math.floor(line.length / 2)])
const result2 = middlePageNumbers2.reduce((acc, page) => acc + page, 0);

console.log(result2)
