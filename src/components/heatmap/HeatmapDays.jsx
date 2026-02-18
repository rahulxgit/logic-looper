/**
 * ============================================
 * HEATMAP DAY LABELS — PRODUCTION (GITHUB STYLE)
 * ============================================
 *
 * Features:
 * - GitHub contribution style labels
 * - fixed 7 row layout
 * - aligned with heatmap cells
 * - deterministic spacing
 * - responsive
 * - accessibility support
 * - future ready for week start config
 *
 * Layout:
 * Sun
 * Mon (shown)
 * Tue
 * Wed (shown)
 * Thu
 * Fri (shown)
 * Sat
 */

/**
 * GitHub shows only:
 * Mon, Wed, Fri
 * Others remain blank for spacing.
 */
const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""]

export default function HeatmapDays() {
  return (
    <div
      className="
        flex
        flex-col
        text-xs
        text-gray-500
        mr-2
        select-none
      "
      aria-hidden="true"
    >
      {DAYS.map((day, index) => (
        <div
          key={index}
          className="
            h-[14px]
            flex
            items-center
            justify-end
          "
          style={{
            // must match heatmap cell height
            marginBottom: "3px",
          }}
        >
          {day}
        </div>
      ))}
    </div>
  )
}
