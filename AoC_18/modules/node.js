class Node {
  constructor(x, y, cost, heuristique, traversable, parent) {
    this.x = x;
    this.y = y;
    this.cost = cost;
    this.heuristique = heuristique;
    this.traversable = traversable;
    this.parent = parent;
  }
}

export { Node };
