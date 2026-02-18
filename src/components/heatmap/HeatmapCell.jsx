import React from "react"
import { intensityMap } from "../../constants/heatmapColors"

/**
 * ============================================
 * HEATMAP CELL — PRODUCTION VERSION
 * ============================================
 *
 * - memoized for performance
 * - safe defaults
 * - prevents crash if data missing
 * - clean tooltip
 */

const HeatmapCell = React.memo(({ dayData }) => {
  // safe fallback (prevents runtime crash)
  if (!dayData) return null

  const { date, intensity = 0, activity } = dayData

  const colorClass = intensityMap[intensity] || intensityMap[0]

  return (
    <div
      title={`${date} | Score: ${activity?.score ?? 0}`}
      className={`
        w-3 h-3 rounded-sm
        ${colorClass}
        hover:ring-1 hover:ring-black/40
        transition
      `}
    />
  )
})

export default HeatmapCell
