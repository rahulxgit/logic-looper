/**
 * ============================================
 * PRODUCTION PROGRESS SERVICE
 * ============================================
 * Handles puzzle progress using dailyActivity model
 * Connects UI → IndexedDB
 * DO NOT create DB here (handled in indexedDB.js)
 */

import {
  saveDailyActivity,
  getActivityByDate,
  getAllActivity,
} from "./indexedDB";

/**
 * Get today's date → YYYY-MM-DD
 */
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

/**
 * ============================================
 * SAVE PUZZLE RESULT
 * ============================================
 * Called when puzzle is solved or attempted
 */
export async function saveProgress({
  solved = false,
  score = 0,
  timeTaken = 0,
  difficulty = 1,
}) {
  try {
    const date = getTodayDate();

    // check if record already exists
    const existing = await getActivityByDate(date);

    const entry = {
      date,
      solved,
      score,
      timeTaken,
      difficulty,
      synced: false,
    };

    /**
     * Production update logic:
     * - keep highest score
     * - once solved → always solved
     */
    if (existing) {
      entry.score = Math.max(existing.score || 0, score);
      entry.solved = existing.solved || solved;
      entry.timeTaken = timeTaken || existing.timeTaken;
      entry.difficulty = difficulty || existing.difficulty;
    }

    return await saveDailyActivity(entry);
  } catch (error) {
    console.error("saveProgress error:", error);
  }
}

/**
 * ============================================
 * GET TODAY PROGRESS
 * ============================================
 */
export async function getTodayProgress() {
  try {
    return await getActivityByDate(getTodayDate());
  } catch (error) {
    console.error("getTodayProgress error:", error);
    return null;
  }
}

/**
 * ============================================
 * GET ALL PROGRESS (Heatmap / Streak)
 * ============================================
 */
export async function getAllProgress() {
  try {
    return await getAllActivity();
  } catch (error) {
    console.error("getAllProgress error:", error);
    return [];
  }
}
