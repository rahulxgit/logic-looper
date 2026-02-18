/**
 * ============================================
 * PRODUCTION PROGRESS SERVICE
 * ============================================
 * Handles puzzle progress using dailyActivity model
 * Connects UI → IndexedDB
 * DO NOT create DB here (handled in indexedDB.js)
 */

import dayjs from "dayjs"

import {
  saveDailyActivity,
  getActivityByDate,
  getAllActivity,
} from "./indexedDB"

/**
 * ============================================
 * GET TODAY DATE → YYYY-MM-DD
 * ============================================
 */
function getTodayDate() {
  return dayjs().format("YYYY-MM-DD")
}

/**
 * ============================================
 * STEP 2 — RECORD DAILY PUZZLE COMPLETION
 * ============================================
 * Called ONLY when puzzle is fully solved
 *
 * Features:
 * - auto daily activity tracking
 * - offline-first
 * - sync ready
 * - heatmap ready
 * - streak ready
 * */
export async function recordDailyCompletion({
  score = 0,
  timeTaken = 0,
  difficulty = 1,
}) {
  try {
    const date = getTodayDate()

    // check existing record
    const existing = await getActivityByDate(date)

    const entry = {
      date,
      solved: true,
      score,
      timeTaken,
      difficulty,
      synced: false,
    }

    /**
     * Production merge rules:
     * - keep highest score
     * - once solved → always solved
     * - keep best difficulty/time if exists
     */
    if (existing) {
      entry.score = Math.max(existing.score || 0, score)
      entry.solved = true
      entry.timeTaken = timeTaken || existing.timeTaken
      entry.difficulty = difficulty || existing.difficulty
    }

    return await saveDailyActivity(entry)
  } catch (error) {
    console.error("recordDailyCompletion error:", error)
  }
}

/**
 * ============================================
 * SAVE PUZZLE RESULT (Attempt or Partial)
 * ============================================
 * Can be used for:
 * - failed attempts
 * - partial progress
 * - manual tracking
 */
export async function saveProgress({
  solved = false,
  score = 0,
  timeTaken = 0,
  difficulty = 1,
}) {
  try {
    const date = getTodayDate()

    const existing = await getActivityByDate(date)

    const entry = {
      date,
      solved,
      score,
      timeTaken,
      difficulty,
      synced: false,
    }

    /**
     * Production update logic:
     * - keep highest score
     * - once solved → always solved
     */
    if (existing) {
      entry.score = Math.max(existing.score || 0, score)
      entry.solved = existing.solved || solved
      entry.timeTaken = timeTaken || existing.timeTaken
      entry.difficulty = difficulty || existing.difficulty
    }

    return await saveDailyActivity(entry)
  } catch (error) {
    console.error("saveProgress error:", error)
  }
}

/**
 * ============================================
 * GET TODAY PROGRESS
 * ============================================
 */
export async function getTodayProgress() {
  try {
    return await getActivityByDate(getTodayDate())
  } catch (error) {
    console.error("getTodayProgress error:", error)
    return null
  }
}

/**
 * ============================================
 * GET ALL PROGRESS (Heatmap / Streak)
 * ============================================
 */
export async function getAllProgress() {
  try {
    return await getAllActivity()
  } catch (error) {
    console.error("getAllProgress error:", error)
    return []
  }
}
