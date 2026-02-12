import BasePuzzle from "./basePuzzle";

class DeductionGrid extends BasePuzzle {
  generate() {
    this.question = "If A > B and B > C, who is greatest?";
    this.answer = "A";

    return { question: this.question };
  }

  validate(input) {
    return input === this.answer;
  }
}

export default DeductionGrid;
