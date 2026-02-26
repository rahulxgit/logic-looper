import { useState, useEffect, useRef } from "react"
import { useDailyPuzzle } from "../hooks/useDailyPuzzle"
import { checkDailyReset } from "../utils/dailyReset"
import { updateStreak } from "../features/streak/streakService"
import PuzzleRenderer from "../components/PuzzleRenderer"
import { calculateScore } from "../utils/scoring"

/**
 * ============================================
 * GAME PAGE — PRODUCTION VERSION
 * ============================================
 *
 * Features:
 * - daily reset check
 * - puzzle solving system
 * - score calculation
 * - streak tracking
 * - auto heatmap update
 * - duplicate submission prevention
 * - clean page-only layout (no navbar)
 */

function Game() {
  /**
   * Daily reset when game loads
   */
  useEffect(() => {
    checkDailyReset()
    startTimeRef.current = Date.now()
  }, [])

  /**
   * Get today's puzzle
   */
  const {
    puzzleData,
    puzzleInstance,
    puzzleType,
    handlePuzzleComplete, // ⭐ important
  } = useDailyPuzzle()

  /**
   * State
   */
  const [userInput, setUserInput] = useState("")
  const [result, setResult] = useState(null)
  const [score, setScore] = useState(null)
  const [isSolved, setIsSolved] = useState(false)

  const startTimeRef = useRef(null)

  /**
   * Loading state
   */
  if (!puzzleData || !puzzleInstance) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-lg">
        Loading Puzzle...
      </div>
    )
  }

  /**
   * Submit Answer
   */
  const handleSubmit = async () => {
    if (!userInput?.trim()) return
    if (isSolved) return

    try {
      const isCorrect = puzzleInstance.validate(userInput.trim())
      setResult(isCorrect)

      if (isCorrect) {
        setIsSolved(true)

        const timeTaken = Math.floor(
          (Date.now() - (startTimeRef.current || Date.now())) / 1000
        )

        const finalScore = calculateScore({
          timeTaken,
          hintsUsed: Number(localStorage.getItem("hintsUsed")) || 0,
        })

        setScore(finalScore)

        // update streak
        updateStreak()

        // ⭐ STEP 2 tracking (IndexedDB + heatmap update)
        await handlePuzzleComplete({
          score: finalScore,
          difficulty: puzzleType || "medium",
        })
      }
    } catch (err) {
      console.error("Validation error:", err)
    }
  }

  /**
   * UI
   */
  return (
    <div className="max-w-3xl mx-auto">

      {/* Puzzle Card */}
      <div className="bg-white rounded-xl shadow-md p-8 text-center">

        {/* Title */}
        <h2 className="text-xl font-semibold mb-6 capitalize">
          {puzzleType} Puzzle
        </h2>

        {/* Puzzle Renderer */}
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
            className={`px-6 py-2 rounded-lg text-white transition ${
              isSolved
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isSolved ? "Solved ✓" : "Submit Answer"}
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

        {/* Score */}
        {score !== null && (
          <div className="mt-3 text-yellow-500 font-semibold">
            ⭐ Score: {score}
          </div>
        )}

      </div>
    </div>
  )
}

export default Game
