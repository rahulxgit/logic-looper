import NumberMatrix from "./numberMatrix";
import PatternMatch from "./patternMatch";
import SequenceSolver from "./sequenceSolver";
import DeductionGrid from "./deductionGrid";
import BinaryLogic from "./binaryLogic";

/*
  All available puzzles
*/
const puzzles = [
  { type: "number", class: NumberMatrix },
  { type: "pattern", class: PatternMatch },
  { type: "sequence", class: SequenceSolver },
  { type: "deduction", class: DeductionGrid },
  { type: "binary", class: BinaryLogic },
];

/*
  Generate puzzle automatically from seed
*/
export function generatePuzzle(seed) {
  const index = seed % puzzles.length;
  const SelectedPuzzle = puzzles[index].class;

  return {
    type: puzzles[index].type,
    instance: new SelectedPuzzle(seed),
  };
}
