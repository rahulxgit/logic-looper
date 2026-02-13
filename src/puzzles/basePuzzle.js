class BasePuzzle {
  constructor(seed) {
    this.seed = seed;
    this.question = "";
    this.answer = null;
    this.type = "generic";
    this.difficulty = "easy";
  }

  /*
    Every puzzle must implement
  */
  generate() {
    throw new Error("generate() must be implemented");
  }

  validate(input) {
    return input === this.answer;
  }

  getHint() {
    return "No hint available";
  }

  getDifficulty() {
    return this.difficulty;
  }

  getType() {
    return this.type;
  }
}

export default BasePuzzle;
