import BasePuzzle from "./basePuzzle";

class NumberMatrix extends BasePuzzle {
  generate() {
    this.solution = [
      [1, 2, 3, 4],
      [2, 4, 1, 3],
      [3, 1, 4, 2],
      [4, 3, 2, 1],
    ];

    return {
      grid: [
        [1, "", "", 4],
        ["", 4, 1, ""],
        ["", 1, 4, ""],
        [4, "", "", 2],
      ],
    };
  }

  validate(input) {
    return JSON.stringify(input) === JSON.stringify(this.solution);
  }
}

export default NumberMatrix;
