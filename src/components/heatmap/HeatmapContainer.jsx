import { useEffect, useState, useMemo } from "react"

// services
import { getAllActivity } from "../../services/indexedDB"
import { buildHeatmapGrid } from "../../services/heatmapService"

// UI components
import HeatmapGrid from "./HeatmapGrid"
import HeatmapLegend from "./HeatmapLegend"
import HeatmapMonths from "./HeatmapMonths"
import HeatmapDays from "./HeatmapDays"

/**
 * ============================================
 * HEATMAP UI COMPONENT (GITHUB STYLE LAYOUT)
 * ============================================
 *
 * - month labels
 * - day labels
 * - grid
 * - legend
 * - clean presentation layer
 */
export function Heatmap({ weeks }) {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">

      {/* Month labels */}
      <div className="ml-8">
        <HeatmapMonths weeks={weeks} />
      </div>

      <div className="flex">
        {/* Day labels */}
        <HeatmapDays />

        {/* Heatmap grid */}
        <HeatmapGrid weeks={weeks} />
      </div>

      {/* Legend */}
      <div className="mt-3">
        <HeatmapLegend />
      </div>
    </div>
  )
}

/**
 * ============================================
 * HEATMAP CONTAINER — PRODUCTION VERSION
 * ============================================
 *
 * Responsibilities:
 * - fetch IndexedDB activity
 * - auto refresh when puzzle completed
 * - process activity → heatmap grid
 * - memoized performance optimization
 * - year support
 * - safe error handling
 * - real-time updates
 */

export default function HeatmapContainer() {
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // production: year-based grid (future ready)
  const currentYear = new Date().getFullYear()

  /**
   * Load activity from IndexedDB
   */
  const loadActivity = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getAllActivity()
      setActivity(data || [])
    } catch (err) {
      console.error("Failed to load activity:", err)
      setError("Failed to load activity")
      setActivity([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Initial load + auto refresh listener
   * - puzzle solve
   * - activity update
   * - cross component sync
   */
  useEffect(() => {
    loadActivity()

    window.addEventListener("activityUpdated", loadActivity)

    return () => {
      window.removeEventListener("activityUpdated", loadActivity)
    }
  }, [])

  /**
   * Convert activity → heatmap grid
   * memoized for performance
   */
  const heatmapGrid = useMemo(() => {
    return buildHeatmapGrid(activity, currentYear)
  }, [activity, currentYear])

  /**
   * Loading UI
   */
  if (loading) {
    return (
      <div className="p-4 border border-white/20 rounded-lg bg-white/5">
        <p className="text-sm opacity-70">Loading activity...</p>
      </div>
    )
  }

  /**
   * Error UI
   */
  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-600">
        {error}
      </div>
    )
  }

  /**
   * Render heatmap
   */
  return (
    <div className="p-4 border border-white/20 rounded-lg bg-white/5">
      <h2 className="font-semibold mb-3">Your Activity</h2>

      {/* GitHub style heatmap */}
      <Heatmap weeks={heatmapGrid} />
    </div>
  )
}
