import BasePuzzle from "./basePuzzle";

class PatternMatch extends BasePuzzle {
  generate() {
    this.sequence = [2, 4, 8, 16];
    this.answer = 32;

    return { sequence: this.sequence };
  }

  validate(input) {
    return Number(input) === this.answer;
  }
}

export default PatternMatch;
