import dayjs from "dayjs"

/**
 * =============================
 * PRODUCTION HEATMAP PROCESSOR
 * =============================
 *
 * Converts IndexedDB activity → heatmap grid
 * Handles:
 * - leap year
 * - timezone safety
 * - fast lookup
 * - intensity calculation
 * - GitHub-style weekly layout
 */

/**
 * Generate all days of current year
 */
export function generateYearDays(year = dayjs().year()) {
  const start = dayjs(`${year}-01-01`)
  const end = start.endOf("year")

  const days = []
  let current = start

  while (current.isBefore(end) || current.isSame(end)) {
    days.push(current)
    current = current.add(1, "day")
  }

  return days
}

/**
 * Convert activity array → fast lookup map
 */
export function createActivityMap(activityList = []) {
  const map = {}

  for (const item of activityList) {
    map[item.date] = item
  }

  return map
}

/**
 * Calculate heatmap intensity level
 *
 * 0 = not played
 * 1 = easy
 * 2 = medium
 * 3 = hard
 * 4 = perfect score
 */
export function getIntensity(activity) {
  if (!activity || !activity.solved) return 0

  if (activity.score >= 100) return 4

  return activity.difficulty || 1
}

/**
 * Convert days → GitHub style week columns
 *
 * Output:
 * [
 *   [day1, day2, ...7], // week 1
 *   [day1, day2, ...7], // week 2
 * ]
 */
export function buildHeatmapGrid(activityList, year) {
  const days = generateYearDays(year)
  const activityMap = createActivityMap(activityList)

  const weeks = []
  let currentWeek = []

  for (const day of days) {
    const dateStr = day.format("YYYY-MM-DD")
    const activity = activityMap[dateStr]

    currentWeek.push({
      date: dateStr,
      day,
      activity,
      intensity: getIntensity(activity),
    })

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  // push last partial week
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  return weeks
}
