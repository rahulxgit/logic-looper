import HeatmapColumn from "./HeatmapColumn"

/**
 * ============================================
 * HEATMAP GRID — PRODUCTION VERSION
 * ============================================
 *
 * Features:
 * - GitHub style column layout
 * - supports weeks (new) + grid (legacy)
 * - responsive horizontal scroll
 * - deterministic spacing
 * - safe fallback handling
 * - production ready
 */

export default function HeatmapGrid({ weeks = [], grid = [] }) {
  /**
   * Backward compatibility
   * Old code → grid
   * New code → weeks
   */
  const data = weeks.length ? weeks : grid

  if (!data?.length) {
    return (
      <div className="text-sm text-gray-400 py-4">
        No activity yet
      </div>
    )
  }

  return (
    <div
      className="
        flex
        gap-[3px]
        overflow-x-auto
        pb-2
      "
      style={{
        // GitHub contribution cell size
        lineHeight: 0,
      }}
    >
      {data.map((week, index) => (
        <HeatmapColumn
          key={index}
          week={week}
        />
      ))}
    </div>
  )
}
