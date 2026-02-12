import BasePuzzle from "./basePuzzle";

class SequenceSolver extends BasePuzzle {
  generate() {
    this.sequence = [1, 3, 6, 10];
    this.answer = 15;

    return { sequence: this.sequence };
  }

  validate(input) {
    return Number(input) === this.answer;
  }
}

export default SequenceSolver;
