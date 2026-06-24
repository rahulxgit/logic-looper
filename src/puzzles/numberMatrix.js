import BasePuzzle from "./basePuzzle";
import { seededRandom } from "../utils/puzzleSeed";

class NumberMatrix extends BasePuzzle {
  constructor(seed) {
    super(seed);
    this.type = "Number Matrix";
    this.difficulty = "medium";

    // Instead of doing it in generate(), we'll initialize here so properties are set.
    this.generateState();
  }

  generateState() {
    const rand = seededRandom(this.seed);
    const SIZE = 4;
    const grid = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));

    // Fill each row with a permutation of [1, 2, 3, 4]
    for (let row = 0; row < SIZE; row++) {
      const nums = [1, 2, 3, 4];
      // Fisher-Yates shuffle using seeded random
      for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
      }
      grid[row] = nums;
    }

    // Remove some cells to create the puzzle (player fills these)
    const puzzle = grid.map((row) => [...row]);
    const removeCount = 8; // difficulty setting
    let removed = 0;
    while (removed < removeCount) {
      const r = Math.floor(rand() * SIZE);
      const c = Math.floor(rand() * SIZE);
      if (puzzle[r][c] !== null) {
        puzzle[r][c] = null; // player fills this
        removed++;
      }
    }

    this.puzzleGrid = puzzle;
    this.solution = grid;

    // We expect the user input to match the entire grid format
    this.answer = this.solution;
  }

  generate() {
    return {
      type: this.type,
      difficulty: this.difficulty,
      question: "Fill the 4x4 matrix so that each row and column contains 1-4 without duplicates.",
      grid: this.puzzleGrid,
      originalGrid: this.puzzleGrid,
      solution: this.solution,
    };
  }

  validate(input) {
    // Input is assumed to be the 4x4 grid submitted by the player
    try {
      let playerGrid = input;
      if (typeof playerGrid === 'string') {
          playerGrid = JSON.parse(playerGrid);
      }

      const SIZE = 4;
      for (let i = 0; i < SIZE; i++) {
        const row = playerGrid[i].filter(Boolean);
        const col = playerGrid.map((r) => r[i]).filter(Boolean);
        if (new Set(row).size !== row.length) return false; // row duplicate
        if (new Set(col).size !== col.length) return false; // col duplicate
      }
      // Check all cells filled
      return playerGrid.every((row) => row.every((cell) => cell !== null && cell !== ""));
    } catch {
      return false;
    }
  }
}

export default NumberMatrix;
