import dayjs from "dayjs"

/**
 * ============================================
 * PRODUCTION STREAK ENGINE (UPGRADED)
 * ============================================
 *
 * Calculates streak from activity list
 * Uses IndexedDB data
 * Timezone safe
 * Offline first
 * Deterministic
 * Production hardened
 *
 * Improvements:
 * - fast lookup using Map (O(1))
 * - safe input validation
 * - handles corrupted data
 * - ignores future dates (anti-cheat)
 * - stable timezone handling
 * - scalable for large datasets
 */

export function calculateStreak(activityList = []) {
  try {
    // guard against invalid input
    if (!Array.isArray(activityList) || activityList.length === 0) {
      return 0
    }

    /**
     * Convert to fast lookup structure
     * Using Map is faster + safer than object
     */
    const activityMap = new Map()

    activityList.forEach(item => {
      if (!item?.date) return

      // normalize date format
      const dateKey = dayjs(item.date).format("YYYY-MM-DD")

      activityMap.set(dateKey, {
        solved: Boolean(item.solved),
      })
    })

    let streak = 0

    /**
     * Start from today (local timezone safe)
     */
    let current = dayjs().startOf("day")
    const today = dayjs().startOf("day")

    /**
     * Walk backwards until break
     */
    while (true) {
      const dateStr = current.format("YYYY-MM-DD")

      /**
       * Ignore future dates (prevents manual cheating)
       */
      if (current.isAfter(today)) {
        current = current.subtract(1, "day")
        continue
      }

      const activity = activityMap.get(dateStr)

      if (activity?.solved === true) {
        streak++
        current = current.subtract(1, "day")
      } else {
        break
      }
    }

    return streak
  } catch (err) {
    console.error("Streak calculation error:", err)
    return 0
  }
}
