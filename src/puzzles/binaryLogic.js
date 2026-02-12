import BasePuzzle from "./basePuzzle";

class BinaryLogic extends BasePuzzle {
  generate() {
    this.question = "1 AND 0 = ?";
    this.answer = 0;

    return { question: this.question };
  }

  validate(input) {
    return Number(input) === this.answer;
  }
}

export default BinaryLogic;
