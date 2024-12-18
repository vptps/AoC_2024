import {Node} from './node.js';

const getNodeListFromGrid = (xSize, ySize) => {
	let nodeList = [];
	const eltList = document.querySelectorAll("#grid > div > div");

	let [x, y] = [0, 0];
	eltList.forEach(elt => {
		let node = new Node(x, y, 0, 0, !elt.classList.contains("blocked"), elt);
		nodeList.push(node);

		if (x < xSize - 1) {
			x++;
		} else {
			x = 0;
			y++;
		}
	});

	return nodeList;
}

const findNode = (x, y, nodeList) => {
	return nodeList.find(node => node.x === x && node.y === y);
}

const compareNodes = (nodeA, nodeB) => {
	if (nodeA.heuristique < nodeB.heuristique) {
		return 1;
	} else if (nodeA.heuristique === nodeB.heuristique) {
		return 0;
	} else {
		return -1;
	}
}

const getNodeNeighbours = (node, nodeList) => {
	const [x, y] = [node.x, node.y];
	let nodeToAdd;
	const neighbours = [];

  // do not consider diagonal neighbours
  for (let i = x-1; i <= x + 1; i++) {
    if (i===x) continue;
    if (i<0) continue;

    nodeToAdd = findNode(i, y, nodeList);
    if (nodeToAdd) neighbours.push(nodeToAdd);
  }

  for (let j = y-1; j <= y+1; j++) {
    if (j===y) continue;
    if (j<0) continue; // TODO: add outer bounds

    nodeToAdd = findNode(x, j, nodeList);
    if (nodeToAdd) neighbours.push(nodeToAdd);
  }

	return neighbours;
}

function getDistance(nodeA, nodeB) {
	return Math.sqrt(Math.pow(nodeB.x - nodeA.x, 2) + Math.pow(nodeB.y - nodeA.y, 2));
}

const showSolution = (node, grid) => {
  let counter = 0;
	let parent = node.parent;
	while (parent !== undefined) {
    grid[parent.y][parent.x] = 'O';
    counter++;
		parent = parent.parent;
	}

  return counter;
}

export {
	findNode,
	compareNodes,
	getNodeNeighbours,
	getDistance,
	showSolution,
};
