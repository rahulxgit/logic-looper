import BasePuzzle from "./basePuzzle";

class BinaryLogic extends BasePuzzle {
  constructor(seed) {
    super(seed);
    this.type = "binary";
    this.difficulty = "easy";
  }

  generate() {
    this.question = "What is 1 AND 0 ?";
    this.answer = "0";

    return {
      question: this.question,
      type: this.type,
      difficulty: this.difficulty,
    };
  }

  validate(input) {
    return input === this.answer;
  }

  getHint() {
    return "AND returns 1 only if both values are 1.";
  }
}

export default BinaryLogic;
