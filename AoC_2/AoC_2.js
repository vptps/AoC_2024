const input = await Deno.readTextFile("input")

const lines = input.split(/\r?\n/).slice(0, -1);

const checkLineSafety = (line) => {
	const levels = line.split(' ');

	if (
		levels.toString() !== levels.toSorted((a, b) => a - b).toString() &&
		levels.toString() !== levels.toSorted((a, b) => b - a).toString()
	) {
		return false;
	} else {
		for (let i = 0; i < levels.length - 1; i++) {
			const distance = Math.abs(levels[i] - levels[i + 1]);
			if (distance < 1 || distance > 3 ) {
				return false;
			}
		}
	}

	return true;
}

let countSafereports = 0;
let countSafereports2 = 0;

for (const line of lines) {
	let isSafe = checkLineSafety(line);
	let isSafe2 = false;

	const variations = [];
	const splittedLine = line.split(' ');
	splittedLine.forEach((elt, index) => {
    const variation = splittedLine.filter((e, i) => i !== index).join(" ");
    variations.push(variation);
	});

	for (const variation of variations) {
		isSafe2 = isSafe2 || checkLineSafety(variation); // just one true is sufficient
	}

	if (isSafe) {
		countSafereports++;
	}
	if (isSafe2) {
		countSafereports2++;
	}
}

console.log(countSafereports, countSafereports2);
