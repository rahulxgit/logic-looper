import { useEffect, useState, useMemo } from "react"

// services
import { getAllActivity } from "../../services/indexedDB"
import { buildHeatmapGrid } from "../../services/heatmapService"

// UI components
import HeatmapGrid from "./HeatmapGrid"
import HeatmapLegend from "./HeatmapLegend"

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
 * - safe error handling
 */

export default function HeatmapContainer() {
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
   */
  useEffect(() => {
    loadActivity()

    // listen when puzzle completion updates activity
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
    return buildHeatmapGrid(activity)
  }, [activity])

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

      <HeatmapGrid grid={heatmapGrid} />
      <HeatmapLegend />
    </div>
  )
}
