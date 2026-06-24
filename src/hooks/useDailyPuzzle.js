import { useEffect, useState, useRef, useCallback } from "react"
import dayjs from "dayjs"
import { generatePuzzle } from "../puzzles/PuzzleFactory"
import { recordDailyCompletion, getTodayProgress } from "../services/progressService"

const difficultyMap = {
  easy: 1,
  medium: 2,
  hard: 3,
}

export function useDailyPuzzle() {
  const [puzzleData, setPuzzleData] = useState(null)
  const [puzzleInstance, setPuzzleInstance] = useState(null)
  const [puzzleType, setPuzzleType] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const startTimeRef = useRef(null)
  const mountedRef = useRef(true)

  const generateDailyPuzzle = useCallback(async () => {
    const seed = Number(dayjs().format("YYYYMMDD"))
    const { type, instance } = generatePuzzle(seed)

    if (!mountedRef.current) return

    setPuzzleType(type)
    setPuzzleInstance(instance)
    setPuzzleData(instance.generate())
    setAttempts(0)

    startTimeRef.current = Date.now()

    try {
      const progress = await getTodayProgress()
      if (progress?.solved && mountedRef.current) {
        setIsCompleted(true)
      }
    } catch (err) {
      console.warn("Could not load today progress:", err)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    setTimeout(() => {
      generateDailyPuzzle()
    }, 0)

    return () => {
      mountedRef.current = false
    }
  }, [generateDailyPuzzle])

  // Midnight auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs()
      if (now.hour() === 0 && now.minute() === 0) {
        generateDailyPuzzle()
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [generateDailyPuzzle])

  const registerAttempt = () => {
    setAttempts((prev) => prev + 1)
  }

  const handlePuzzleComplete = useCallback(
    async ({ score = 0, difficulty = "medium" }) => {
      if (!puzzleInstance || isCompleted) return

      try {
        const timeTaken = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        )

        const difficultyValue = difficultyMap[difficulty] || difficultyMap.medium

        await recordDailyCompletion({
          score,
          timeTaken,
          difficulty: difficultyValue,
        })

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

  const resetPuzzle = () => {
    if (!puzzleInstance) return
    setPuzzleData(puzzleInstance.generate())
    setIsCompleted(false)
    setAttempts(0)
    startTimeRef.current = Date.now()
  }

  const getElapsedTime = () => {
    if (!startTimeRef.current) return 0
    return Math.floor((Date.now() - startTimeRef.current) / 1000)
  }

  return {
    puzzleData,
    puzzleInstance,
    puzzleType,
    isCompleted,
    attempts,
    handlePuzzleComplete,
    resetPuzzle,
    registerAttempt,
    getElapsedTime,
  }
}
