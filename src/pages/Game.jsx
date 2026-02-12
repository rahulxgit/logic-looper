import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useDailyPuzzle } from "../hooks/useDailyPuzzle";

import SequencePuzzle from "../components/puzzle/SequencePuzzle";
import PatternPuzzle from "../components/puzzle/PatternPuzzle";
import DeductionPuzzle from "../components/puzzle/DeductionPuzzle";
import BinaryPuzzle from "../components/puzzle/BinaryPuzzle";
import NumberMatrixPuzzle from "../components/puzzle/NumberMatrixPuzzle";

function Game() {
  const { puzzleData, puzzleInstance, puzzleType } = useDailyPuzzle();
  const [result, setResult] = useState(null);

  if (!puzzleData) {
    return (
      <MainLayout>
        <div className="text-center text-white text-lg">
          Loading Puzzle...
        </div>
      </MainLayout>
    );
  }

  const handleSubmit = (input) => {
    const isCorrect = puzzleInstance.validate(input);
    setResult(isCorrect);
  };

  const renderPuzzle = () => {
    switch (puzzleType) {
      case "sequence":
        return <SequencePuzzle data={puzzleData} onSubmit={handleSubmit} />;

      case "pattern":
        return <PatternPuzzle data={puzzleData} onSubmit={handleSubmit} />;

      case "deduction":
        return <DeductionPuzzle data={puzzleData} onSubmit={handleSubmit} />;

      case "binary":
        return <BinaryPuzzle data={puzzleData} onSubmit={handleSubmit} />;

      case "number":
        return <NumberMatrixPuzzle data={puzzleData} onSubmit={handleSubmit} />;

      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-semibold mb-4 capitalize text-center">
          {puzzleType} Puzzle
        </h2>

        {renderPuzzle()}

        {result !== null && (
          <div
            className={`mt-4 text-center font-bold text-lg ${
              result ? "text-green-600" : "text-red-600"
            }`}
          >
            {result ? "🎉 Correct!" : "❌ Try Again"}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Game;
