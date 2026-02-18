import { useEffect, useState, useRef, useCallback } from "react"
import dayjs from "dayjs"
import { generatePuzzle } from "../puzzles/PuzzleFactory"
import { recordDailyCompletion } from "../services/progressService"
import { getTodayProgress } from "../services/progressService"

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
 * DAILY PUZZLE HOOK — PRODUCTION+ VERSION
 * ============================================
 *
 * Features:
 * - deterministic daily puzzle
 * - timezone-safe seed generation
 * - auto resume if already solved today
 * - timer tracking
 * - completion handler
 * - IndexedDB progress tracking
 * - heatmap auto refresh
 * - duplicate prevention
 * - midnight puzzle refresh
 * - attempt counter (analytics ready)
 * - offline-first architecture
 */

export function useDailyPuzzle() {
  const [puzzleData, setPuzzleData] = useState(null)
  const [puzzleInstance, setPuzzleInstance] = useState(null)
  const [puzzleType, setPuzzleType] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [attempts, setAttempts] = useState(0)

  // refs
  const startTimeRef = useRef(null)
  const mountedRef = useRef(true)

  /**
   * ============================================
   * GENERATE DAILY PUZZLE
   * ============================================
   */
  const generateDailyPuzzle = useCallback(async () => {
    // timezone-safe local date seed
    const seed = Number(dayjs().format("YYYYMMDD"))

    const { type, instance } = generatePuzzle(seed)

    if (!mountedRef.current) return

    setPuzzleType(type)
    setPuzzleInstance(instance)
    setPuzzleData(instance.generate())
    setAttempts(0)

    // start timer
    startTimeRef.current = Date.now()

    // check if already solved today (resume state)
    try {
      const progress = await getTodayProgress()
      if (progress?.solved) {
        setIsCompleted(true)
      }
    } catch (err) {
      console.warn("Could not load today progress:", err)
    }
  }, [])

  /**
   * ============================================
   * INITIAL LOAD
   * ============================================
   */
  useEffect(() => {
    mountedRef.current = true
    generateDailyPuzzle()

    return () => {
      mountedRef.current = false
    }
  }, [generateDailyPuzzle])

  /**
   * ============================================
   * MIDNIGHT AUTO REFRESH (REAL PRODUCT FEATURE)
   * ============================================
   * Loads new puzzle when day changes
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs()
      if (now.hour() === 0 && now.minute() === 0) {
        generateDailyPuzzle()
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [generateDailyPuzzle])

  /**
   * ============================================
   * TRACK ATTEMPT (for analytics)
   * ============================================
   */
  const registerAttempt = () => {
    setAttempts((prev) => prev + 1)
  }

  /**
   * ============================================
   * HANDLE PUZZLE COMPLETION
   * ============================================
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

        // record completion
        await recordDailyCompletion({
          score,
          timeTaken,
          difficulty: difficultyValue,
        })

        // notify global systems (heatmap, streak, etc.)
        window.dispatchEvent(new Event("activityUpdated"))

        setIsCompleted(true)

        console.log("✅ Daily puzzle recorded:", {
          score,
          timeTaken,
          difficulty: difficultyValue,
          attempts,
        })
      } catch (error) {
        console.error("Puzzle completion error:", error)
      }
    },
    [puzzleInstance, isCompleted, attempts]
  )

  /**
   * ============================================
   * RESET PUZZLE (DEV / TEST / RETRY)
   * ============================================
   */
  const resetPuzzle = () => {
    if (!puzzleInstance) return

    setPuzzleData(puzzleInstance.generate())
    setIsCompleted(false)
    setAttempts(0)
    startTimeRef.current = Date.now()
  }

  /**
   * ============================================
   * GET CURRENT TIMER VALUE
   * ============================================
   */
  const getElapsedTime = () => {
    if (!startTimeRef.current) return 0
    return Math.floor((Date.now() - startTimeRef.current) / 1000)
  }

  /**
   * ============================================
   * PUBLIC API
   * ============================================
   */
  return {
    puzzleData,
    puzzleInstance,
    puzzleType,
    isCompleted,
    attempts,

    // actions
    handlePuzzleComplete,
    resetPuzzle,
    registerAttempt,

    // helpers
    getElapsedTime,
  }
}
