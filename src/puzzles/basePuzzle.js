class BasePuzzle {
  constructor(seed) {
    this.seed = seed;
  }

  generate() {
    throw new Error("Generate method not implemented");
  }

  validate() {
    throw new Error("Validate method not implemented");
  }
}

export default BasePuzzle;
