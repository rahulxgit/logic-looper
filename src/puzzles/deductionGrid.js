import BasePuzzle from "./basePuzzle";
import { seededRandom } from "../utils/puzzleSeed";

// Pool of deduction-style problems with varied difficulty
const DEDUCTION_POOL = [
  {
    question: "If A > B and B > C, who is greatest?",
    answer: "A",
    hint: "Follow the chain: A is bigger than B, and B is bigger than C.",
  },
  {
    question: "If X < Y and Y < Z, who is smallest?",
    answer: "X",
    hint: "X is less than Y, which is less than Z.",
  },
  {
    question: "Tom is older than Sam. Sam is older than Raj. Who is youngest?",
    answer: "Raj",
    hint: "Trace the chain from oldest to youngest.",
  },
  {
    question: "P > Q, Q > R, R > S. Who is second greatest?",
    answer: "Q",
    hint: "Order them from greatest: P, Q, R, S.",
  },
  {
    question: "Alice is taller than Bob. Carol is shorter than Bob. Who is tallest?",
    answer: "Alice",
    hint: "Alice > Bob > Carol.",
  },
  {
    question: "If cat > dog and dog > fish in size, who is smallest?",
    answer: "fish",
    hint: "Follow the size chain downward.",
  },
  {
    question: "M < N, N < O, O < P. Who is greatest?",
    answer: "P",
    hint: "Follow the chain: M < N < O < P.",
  },
  {
    question: "Red is faster than Blue. Green is slower than Blue. What is the order fastest to slowest? (answer: first name only)",
    answer: "Red",
    hint: "Red > Blue > Green.",
  },
];

class DeductionGrid extends BasePuzzle {
  constructor(seed) {
    super(seed);
    this.type = "deduction";
    this.difficulty = "medium";
    this.generateState();
  }

  generateState() {
    const rand = seededRandom(this.seed);
    const index = Math.floor(rand() * DEDUCTION_POOL.length);
    const selected = DEDUCTION_POOL[index];

    this.question = selected.question;
    this.answer = selected.answer;
    this._hint = selected.hint;
  }

  generate() {
    return {
      type: this.type,
      difficulty: this.difficulty,
      question: this.question,
    };
  }

  validate(input) {
    return input.trim().toLowerCase() === this.answer.toLowerCase();
  }

  getHint() {
    return this._hint;
  }
}

export default DeductionGrid;
