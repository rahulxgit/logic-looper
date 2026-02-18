import { generateMonthLabels } from "../../services/heatmapService"

/**
 * ============================================
 * HEATMAP MONTH LABELS — PRODUCTION (GITHUB STYLE)
 * ============================================
 *
 * Features:
 * - GitHub contribution style month labels
 * - grid aligned with heatmap columns
 * - deterministic spacing
 * - responsive layout
 * - supports padded weeks
 * - backward compatible (weeks / grid)
 * - accessibility safe
 *
 * Layout:
 * Jan    Feb    Mar
 * aligned to week columns
 */

export default function HeatmapMonths({ weeks = [], grid = [] }) {
  /**
   * Backward compatibility
   * Old → grid
   * New → weeks
   */
  const data = weeks.length ? weeks : grid

  if (!data?.length) return null

  const labels = generateMonthLabels(data)

  return (
    <div
      className="
        relative
        mb-1
        text-xs
        text-gray-500
        select-none
      "
      style={{
        // must match HeatmapGrid column width
        display: "grid",
        gridTemplateColumns: `repeat(${data.length}, 14px)`,
        columnGap: "3px",
      }}
      aria-hidden="true"
    >
      {labels.map(({ index, label }) => (
        <div
          key={index}
          className="whitespace-nowrap"
          style={{
            gridColumnStart: index + 1,
          }}
        >
          {label}
        </div>
      ))}
    </div>
  )
}
