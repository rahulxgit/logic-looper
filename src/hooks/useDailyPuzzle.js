import { useEffect, useState } from "react";
import { getDailySeed } from "../utils/seedGenerator";
import { getTodayPuzzleType } from "../utils/getPuzzleType";
import { createPuzzle } from "../puzzles/PuzzleFactory";

export function useDailyPuzzle() {
  const [puzzleData, setPuzzleData] = useState(null);
  const [puzzleInstance, setPuzzleInstance] = useState(null);
  const [puzzleType, setPuzzleType] = useState(null);

  useEffect(() => {
    const seed = getDailySeed();
    const type = getTodayPuzzleType();
    const puzzle = createPuzzle(type, seed);

    setPuzzleType(type);
    setPuzzleInstance(puzzle);
    setPuzzleData(puzzle.generate());
  }, []);

  return { puzzleData, puzzleInstance, puzzleType };
}
