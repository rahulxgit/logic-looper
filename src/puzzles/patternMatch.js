import BasePuzzle from "./basePuzzle";
import { seededRandom } from "../utils/puzzleSeed";

// Different pattern types to keep things varied
const PATTERN_TYPES = ["multiply", "add", "square", "fibonacci-like", "subtract"];

class PatternMatch extends BasePuzzle {
  constructor(seed) {
    super(seed);
    this.type = "pattern";
    this.difficulty = "easy";
    this.generateState();
  }

  generateState() {
    const rand = seededRandom(this.seed);
    const patternType = PATTERN_TYPES[Math.floor(rand() * PATTERN_TYPES.length)];

    let sequence = [];
    let answer;

    if (patternType === "multiply") {
      const start = Math.floor(rand() * 3) + 1; // 1-3
      const factor = Math.floor(rand() * 3) + 2; // 2-4
      sequence = [start, start * factor, start * factor ** 2, start * factor ** 3];
      answer = start * factor ** 4;
    } else if (patternType === "add") {
      const start = Math.floor(rand() * 5) + 1;
      const step = Math.floor(rand() * 10) + 3;
      sequence = [start, start + step, start + 2 * step, start + 3 * step];
      answer = start + 4 * step;
    } else if (patternType === "square") {
      const offset = Math.floor(rand() * 3) + 1;
      sequence = [
        (1 + offset) ** 2,
        (2 + offset) ** 2,
        (3 + offset) ** 2,
        (4 + offset) ** 2,
      ];
      answer = (5 + offset) ** 2;
    } else if (patternType === "fibonacci-like") {
      const a = Math.floor(rand() * 4) + 1;
      const b = Math.floor(rand() * 4) + 2;
      sequence = [a, b, a + b, a + 2 * b];
      answer = 2 * a + 3 * b;
    } else {
      // subtract
      const start = Math.floor(rand() * 50) + 50;
      const step = Math.floor(rand() * 8) + 3;
      sequence = [start, start - step, start - 2 * step, start - 3 * step];
      answer = start - 4 * step;
    }

    this.sequence = sequence;
    this.answer = answer;
  }

  generate() {
    return {
      type: this.type,
      difficulty: this.difficulty,
      question: `What comes next? ${this.sequence.join(" → ")} → ?`,
      sequence: this.sequence,
    };
  }

  validate(input) {
    return Number(input) === this.answer;
  }

  getHint() {
    return "Look at the relationship between consecutive numbers.";
  }
}

export default PatternMatch;
