import dayjs from "dayjs"

/**
 * ============================================
 * PRODUCTION HEATMAP PROCESSOR (GITHUB LEVEL)
 * ============================================
 *
 * Converts IndexedDB activity → heatmap grid
 *
 * Features:
 * - GitHub style weekly layout (Sun → Sat)
 * - leap year safe
 * - timezone safe
 * - deterministic grid
 * - padded weeks
 * - fast lookup using Map
 * - stable month labels
 * - scalable intensity system
 * - production performance
 */

/**
 * ============================================
 * Generate all days of year (timezone safe)
 * ============================================
 */
export function generateYearDays(year = dayjs().year()) {
  const start = dayjs(`${year}-01-01`).startOf("day")
  const end = start.endOf("year").startOf("day")

  const days = []
  let current = start

  while (current.isBefore(end) || current.isSame(end)) {
    days.push(current)
    current = current.add(1, "day")
  }

  return days
}

/**
 * ============================================
 * Convert activity → fast lookup map
 * ============================================
 */
export function createActivityMap(activityList = []) {
  const map = new Map()

  for (const item of activityList) {
    if (!item?.date) continue

    const key = dayjs(item.date).format("YYYY-MM-DD")
    map.set(key, item)
  }

  return map
}

/**
 * ============================================
 * Calculate intensity (GitHub style scale)
 *
 * 0 → no activity
 * 1 → low
 * 2 → medium
 * 3 → high
 * 4 → perfect
 * ============================================
 */
export function getIntensity(activity) {
  if (!activity || !activity.solved) return 0

  if (activity.score >= 100) return 4

  // difficulty fallback
  return Math.min(Math.max(activity.difficulty || 1, 1), 3)
}

/**
 * ============================================
 * Pad year start so first week starts Sunday
 * (GitHub style alignment)
 * ============================================
 */
function padStartToSunday(days) {
  const firstDay = days[0]
  const padding = firstDay.day() // 0=Sunday

  const padded = [...days]

  for (let i = 0; i < padding; i++) {
    padded.unshift(null)
  }

  return padded
}

/**
 * ============================================
 * Pad end so last week has 7 days
 * ============================================
 */
function padEndToFullWeeks(days) {
  const remainder = days.length % 7
  if (remainder === 0) return days

  const needed = 7 - remainder
  return [...days, ...Array(needed).fill(null)]
}

/**
 * ============================================
 * Build GitHub style heatmap grid
 *
 * Output:
 * [
 *   [7 days], // week 1
 *   [7 days], // week 2
 * ]
 * ============================================
 */
export function buildHeatmapGrid(activityList = [], year) {
  const yearDays = generateYearDays(year)
  const activityMap = createActivityMap(activityList)

  // pad for GitHub style alignment
  let paddedDays = padStartToSunday(yearDays)
  paddedDays = padEndToFullWeeks(paddedDays)

  const weeks = []

  for (let i = 0; i < paddedDays.length; i += 7) {
    const weekSlice = paddedDays.slice(i, i + 7)

    const week = weekSlice.map((day) => {
      if (!day) {
        return {
          date: null,
          day: null,
          activity: null,
          intensity: 0,
        }
      }

      const dateStr = day.format("YYYY-MM-DD")
      const activity = activityMap.get(dateStr)

      return {
        date: dateStr,
        day,
        activity,
        intensity: getIntensity(activity),
      }
    })

    weeks.push(week)
  }

  return weeks
}

/**
 * ============================================
 * Generate GitHub style month labels
 * Shows month when it changes
 * ============================================
 */
export function generateMonthLabels(weeks = []) {
  const labels = []
  let lastMonth = null

  weeks.forEach((week, index) => {
    const firstValidDay = week.find((d) => d?.day)

    if (!firstValidDay?.day) return

    const month = firstValidDay.day.format("MMM")

    if (month !== lastMonth) {
      labels.push({
        index,
        label: month,
      })

      lastMonth = month
    }
  })

  return labels
}
