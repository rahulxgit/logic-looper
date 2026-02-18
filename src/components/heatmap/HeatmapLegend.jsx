// services / constants
import { intensityMap } from "../../constants/heatmapColors"

/**
 * ============================================
 * HEATMAP LEGEND — PRODUCTION VERSION
 * ============================================
 *
 * Features:
 * - GitHub-style "Less → More" indicator
 * - accessible
 * - responsive layout
 * - safe color fallback
 * - reusable component
 */

export default function HeatmapLegend() {
  const levels = [0, 1, 2, 3, 4]

  return (
    <div
      className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-600"
      aria-label="Heatmap intensity legend"
    >
      {/* Label */}
      <span className="opacity-70">Less</span>

      {/* Color Levels */}
      <div className="flex gap-1">
        {levels.map((level) => {
          const colorClass = intensityMap[level] || intensityMap[0]

          return (
            <div
              key={level}
              title={`Intensity level ${level}`}
              className={`w-3 h-3 rounded-sm border border-black/10 ${colorClass}`}
            />
          )
        })}
      </div>

      {/* Label */}
      <span className="opacity-70">More</span>
    </div>
  )
}
