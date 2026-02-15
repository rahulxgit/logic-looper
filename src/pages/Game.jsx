import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { useDailyPuzzle } from "../hooks/useDailyPuzzle";
import { checkDailyReset } from "../utils/dailyReset";
import { updateStreak } from "../features/streak/streakService";
import PuzzleRenderer from "../components/PuzzleRenderer";
import { calculateScore } from "../utils/scoring";

function Game() {
  // ✅ Daily reset when game loads
  useEffect(() => {
    checkDailyReset();
  }, []);

  // ✅ Get today's puzzle
  const { puzzleData, puzzleInstance, puzzleType } = useDailyPuzzle();

  // State
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState(null);
  const [startTime] = useState(Date.now());
  const [score, setScore] = useState(null);
  const [isSolved, setIsSolved] = useState(false); // prevent multiple streak updates

  // Loading state
  if (!puzzleData || !puzzleInstance) {
    return (
      <MainLayout>
        <div className="center full-screen text-gray-900 text-lg">
          Loading Puzzle...
        </div>
      </MainLayout>
    );
  }

  // ✅ Submit answer
  const handleSubmit = () => {
    if (!userInput?.trim()) return;

    // prevent re-submitting after solved
    if (isSolved) return;

    try {
      const isCorrect = puzzleInstance.validate(userInput.trim());
      setResult(isCorrect);

      // If correct → calculate score + update streak (only once)
      if (isCorrect) {
        setIsSolved(true);

        const timeTaken = Math.floor((Date.now() - startTime) / 1000);

        const finalScore = calculateScore({
          timeTaken,
          hintsUsed: Number(localStorage.getItem("hintsUsed")) || 0,
        });

        setScore(finalScore);
        updateStreak();
      }
    } catch (err) {
      console.error("Validation error:", err);
    }
  };

  return (
    <MainLayout>
      <div className="app-layout">
        <div className="card fade-in max-w-2xl mx-auto text-center">

          {/* Puzzle Title */}
          <h2 className="text-xl font-semibold mb-6 capitalize">
            {puzzleType} Puzzle
          </h2>

          {/* Puzzle UI */}
          <PuzzleRenderer
            puzzleData={puzzleData}
            userInput={userInput}
            setUserInput={setUserInput}
          />

          {/* Submit Button */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={isSolved}
              className={`px-6 py-2 text-white rounded-lg transition ${
                isSolved
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Submit Answer
            </button>
          </div>

          {/* Result Message */}
          {result !== null && (
            <div
              className={`mt-5 text-lg font-bold ${
                result ? "text-green-500" : "text-red-500"
              }`}
            >
              {result ? "🎉 Correct!" : "❌ Try Again"}
            </div>
          )}

          {/* Score Display */}
          {score !== null && (
            <div className="mt-3 text-yellow-500 font-semibold">
              ⭐ Score: {score}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Game;
