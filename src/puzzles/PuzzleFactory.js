import NumberMatrix from "./numberMatrix";
import PatternMatch from "./patternMatch";
import SequenceSolver from "./sequenceSolver";
import DeductionGrid from "./deductionGrid";
import BinaryLogic from "./binaryLogic";

export function createPuzzle(type, seed) {
  switch (type) {
    case "number":
      return new NumberMatrix(seed);

    case "pattern":
      return new PatternMatch(seed);

    case "sequence":
      return new SequenceSolver(seed);

    case "deduction":
      return new DeductionGrid(seed);

    case "binary":
      return new BinaryLogic(seed);

    default:
      throw new Error("Invalid puzzle type");
  }
}
