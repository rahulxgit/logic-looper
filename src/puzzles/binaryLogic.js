import BasePuzzle from "./basePuzzle";
import { seededRandom } from "../utils/puzzleSeed";

const OPERATIONS = [
  {
    op: "AND",
    fn: (a, b) => a & b,
    hint: "AND returns 1 only if both values are 1.",
  },
  {
    op: "OR",
    fn: (a, b) => a | b,
    hint: "OR returns 1 if at least one value is 1.",
  },
  {
    op: "XOR",
    fn: (a, b) => a ^ b,
    hint: "XOR returns 1 only if the values are different.",
  },
  {
    op: "NAND",
    fn: (a, b) => (a & b) === 1 ? 0 : 1,
    hint: "NAND is the opposite of AND — returns 0 only when both are 1.",
  },
  {
    op: "NOR",
    fn: (a, b) => (a | b) === 0 ? 1 : 0,
    hint: "NOR is the opposite of OR — returns 1 only when both are 0.",
  },
];

class BinaryLogic extends BasePuzzle {
  constructor(seed) {
    super(seed);
    this.type = "binary";
    this.difficulty = "easy";
    this.generateState();
  }

  generateState() {
    const rand = seededRandom(this.seed);

    const opIndex = Math.floor(rand() * OPERATIONS.length);
    const { op, fn, hint } = OPERATIONS[opIndex];

    const a = Math.floor(rand() * 2); // 0 or 1
    const b = Math.floor(rand() * 2); // 0 or 1
    const result = fn(a, b);

    this.question = `What is ${a} ${op} ${b}?`;
    this.answer = String(result);
    this._hint = hint;
  }

  generate() {
    return {
      question: this.question,
      type: this.type,
      difficulty: this.difficulty,
      hint: this._hint,
    };
  }

  validate(input) {
    return input.trim() === this.answer;
  }

  getHint() {
    return this._hint;
  }
}

export default BinaryLogic;
