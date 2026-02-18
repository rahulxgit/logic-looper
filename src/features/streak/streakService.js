import { getTodayKey } from "../../utils/dailyReset"
import { getAllActivity } from "../../services/indexedDB"
import { calculateStreak } from "./streakEngine"

/**
 * ============================================
 * PRODUCTION STREAK SERVICE
 * ============================================
 *
 * Architecture:
 * - IndexedDB → source of truth (production)
 * - localStorage → UI cache + legacy fallback
 * - deterministic streak calculation
 * - offline first
 * - backward compatible
 */

/**
 * ============================================
 * PRODUCTION — Get streak from IndexedDB
 * ============================================
 */
export async function getStreak() {
  try {
    const activity = await getAllActivity()
    const streak = calculateStreak(activity)

    /**
     * Cache in localStorage for fast UI load
     * (not source of truth)
     */
    localStorage.setItem("streakCount", streak)

    return streak
  } catch (err) {
    console.error("Streak error:", err)

    // fallback to cached value
    return Number(localStorage.getItem("streakCount")) || 0
  }
}

/**
 * ============================================
 * LEGACY — Update streak (localStorage based)
 * Used only if IndexedDB activity event triggers UI refresh
 * ============================================
 */
export const updateStreak = () => {
  const today = getTodayKey()
  const lastDate = localStorage.getItem("streakLastDate")
  let streak = Number(localStorage.getItem("streakCount")) || 0

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = yesterday.toISOString().split("T")[0]

  if (lastDate === yesterdayKey) {
    streak++
  } else if (lastDate !== today) {
    streak = 1
  }

  localStorage.setItem("streakCount", streak)
  localStorage.setItem("streakLastDate", today)

  saveHeatmap(today)

  /**
   * Notify app streak changed
   */
  window.dispatchEvent(new Event("activityUpdated"))

  return streak
}

/**
 * ============================================
 * Heatmap local cache
 * ============================================
 */
const saveHeatmap = (date) => {
  const heatmap = JSON.parse(localStorage.getItem("heatmap")) || {}
  heatmap[date] = true
  localStorage.setItem("heatmap", JSON.stringify(heatmap))
}

/**
 * ============================================
 * FAST CACHE — Read streak (no async)
 * Used only for quick UI render
 * ============================================
 */
export const getCachedStreak = () =>
  Number(localStorage.getItem("streakCount")) || 0

/**
 * ============================================
 * Heatmap reader
 * ============================================
 */
export const getHeatmap = () =>
  JSON.parse(localStorage.getItem("heatmap")) || {}
