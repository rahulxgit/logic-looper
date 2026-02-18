import { useEffect, useState, useRef, useCallback } from "react"
import dayjs from "dayjs"
import { generatePuzzle } from "../puzzles/PuzzleFactory"

// ✅ STEP 2 — progress tracking
// import { recordDailyCompletion } from "@/services/progressService"
import { recordDailyCompletion } from "../services/progressService"

/**
 * ============================================
 * DIFFICULTY MAP (Production Standard)
 * ============================================
 */
const difficultyMap = {
  easy: 1,
  medium: 2,
  hard: 3,
}

/**
 * ============================================
 * DAILY PUZZLE HOOK — PRODUCTION VERSION
 * ============================================
 *
 * Features:
 * - deterministic daily puzzle
 * - timer tracking
 * - completion handler
 * - score recording
 * - IndexedDB progress tracking
 * - heatmap + streak ready
 * - offline-first
 */
export function useDailyPuzzle() {
  const [puzzleData, setPuzzleData] = useState(null)
  const [puzzleInstance, setPuzzleInstance] = useState(null)
  const [puzzleType, setPuzzleType] = useState(null)

  const [isCompleted, setIsCompleted] = useState(false)

  // track start time safely
  const startTimeRef = useRef(null)

  /**
   * ============================================
   * GENERATE DAILY PUZZLE (existing logic kept)
   * ============================================
   */
  useEffect(() => {
    const seed = Number(dayjs().format("YYYYMMDD"))

    const { type, instance } = generatePuzzle(seed)

    setPuzzleType(type)
    setPuzzleInstance(instance)
    setPuzzleData(instance.generate())

    // start timer
    startTimeRef.current = Date.now()
  }, [])

  /**
   * ============================================
   * STEP 2 — HANDLE PUZZLE COMPLETION
   * ============================================
   *
   * Call this ONLY when puzzle fully solved
   */
  const handlePuzzleComplete = useCallback(
    async ({ score = 0, difficulty = "medium" }) => {
      if (!puzzleInstance || isCompleted) return

      try {
        const timeTaken = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        )

        const difficultyValue =
          difficultyMap[difficulty] || difficultyMap.medium

        // ✅ record activity in IndexedDB
        await recordDailyCompletion({
          score,
          timeTaken,
          difficulty: difficultyValue,
        })

        setIsCompleted(true)

        console.log("✅ Daily puzzle recorded:", {
          score,
          timeTaken,
          difficulty: difficultyValue,
        })
      } catch (error) {
        console.error("Puzzle completion error:", error)
      }
    },
    [puzzleInstance, isCompleted]
  )

  /**
   * ============================================
   * OPTIONAL — RESET PUZZLE (DEV / TEST / RETRY)
   * ============================================
   */
  const resetPuzzle = () => {
    if (!puzzleInstance) return

    setPuzzleData(puzzleInstance.generate())
    setIsCompleted(false)
    startTimeRef.current = Date.now()
  }

  /**
   * ============================================
   * RETURN PUBLIC API
   * ============================================
   */
  return {
    puzzleData,
    puzzleInstance,
    puzzleType,

    // new production features
    handlePuzzleComplete,
    resetPuzzle,
    isCompleted,
  }
}
