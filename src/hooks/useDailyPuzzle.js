import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { generatePuzzle } from "../puzzles/PuzzleFactory";
import BinaryLogic from "../puzzles/binaryLogic";

export function useDailyPuzzle() {
  const [puzzleData, setPuzzleData] = useState(null);
  const [puzzleInstance, setPuzzleInstance] = useState(null);
  const [puzzleType, setPuzzleType] = useState(null);

  useEffect(() => {
    const seed = Number(dayjs().format("YYYYMMDD"));

    const { type, instance } = generatePuzzle(seed);

    setPuzzleType(type);
    setPuzzleInstance(instance);
    setPuzzleData(instance.generate());
  }, []);

  return {
    puzzleData,
    puzzleInstance,
    puzzleType,
  };
}
