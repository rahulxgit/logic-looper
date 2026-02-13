import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useDailyPuzzle } from "../hooks/useDailyPuzzle";
import PuzzleRenderer from "../components/PuzzleRenderer";

function Game() {

  // ✅ ALWAYS declare hook first
  const { puzzleData, puzzleInstance, puzzleType } = useDailyPuzzle();

  // debug logs AFTER declaration
  console.log("TODAY PUZZLE:", puzzleType);
  console.log("PUZZLE TYPE:", puzzleType);
  console.log("PUZZLE DATA:", puzzleData);
  console.log("PUZZLE INSTANCE:", puzzleInstance);

  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState(null);

  if (!puzzleData || !puzzleInstance) {
    return (
      <MainLayout>
        <div className="text-center text-white text-lg">
          Loading Puzzle...
        </div>
      </MainLayout>
    );
  }

  const handleSubmit = () => {
    if (!userInput) return;

    const isCorrect = puzzleInstance.validate(userInput);
    setResult(isCorrect);
  };

  return (
    <MainLayout>
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-2xl mx-auto">

        <h2 className="text-xl font-semibold mb-6 capitalize text-center">
          {puzzleType} Puzzle
        </h2>

        <PuzzleRenderer
          puzzleData={puzzleData}
          userInput={userInput}
          setUserInput={setUserInput}
        />


        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Submit Answer
          </button>
        </div>


        {result !== null && (
          <div
            className={`mt-4 text-center font-bold text-lg ${result ? "text-green-600" : "text-red-600"
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
