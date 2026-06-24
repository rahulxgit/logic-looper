import BasePuzzle from "./basePuzzle";
import { seededRandom } from "../utils/puzzleSeed";

class SequenceSolver extends BasePuzzle {
  constructor(seed) {
    super(seed);
    this.type = "Sequence";
    this.difficulty = "easy";

    this.generateState();
  }

  generateState() {
    const rand = seededRandom(this.seed);
    const start = Math.floor(rand() * 5) + 1; // 1-5
    const step = Math.floor(rand() * 4) + 1;  // 1-4

    // Build 5-element arithmetic sequence with one gap (position 3)
    const full = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
    const gapIndex = Math.floor(rand() * 3) + 1; // gap at index 1, 2, or 3
    const answer = full[gapIndex];
    const sequence = full.map((v, i) => (i === gapIndex ? null : v));

    this.sequence = sequence;
    this.answer = answer.toString();
    this.gapIndex = gapIndex;
  }

  generate() {
    return {
      type: this.type,
      difficulty: this.difficulty,
      question: `Find the missing number in the sequence: ${this.sequence.map(n => n === null ? "?" : n).join(", ")}`,
      sequence: this.sequence,
    };
  }

  validate(input) {
    return parseInt(input) === parseInt(this.answer);
  }
}

export default SequenceSolver;
