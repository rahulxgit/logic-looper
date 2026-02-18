import { useEffect, useState, useMemo } from "react"

// ✅ use relative paths (Vite project)
import { getAllActivity } from "../../services/indexedDB"
import { buildHeatmapGrid } from "../../services/heatmapService"

import HeatmapGrid from "./HeatmapGrid"

/**
 * ============================================
 * HEATMAP CONTAINER — PRODUCTION VERSION
 * ============================================
 *
 * Responsibilities:
 * - fetch IndexedDB activity
 * - process data → heatmap grid
 * - memoized performance optimization
 * - pass data to UI grid
 */

export default function HeatmapContainer() {
  const [activity, setActivity] = useState([])

  /**
   * Load activity from IndexedDB
   */
  useEffect(() => {
    async function loadActivity() {
      try {
        const data = await getAllActivity()
        setActivity(data || [])
      } catch (error) {
        console.error("Failed to load activity:", error)
        setActivity([])
      }
    }

    loadActivity()
  }, [])

  /**
   * Convert activity → heatmap grid
   * memoized for performance
   */
  const heatmapGrid = useMemo(() => {
    return buildHeatmapGrid(activity)
  }, [activity])

  return (
    <div className="p-4 border border-white/20 rounded-lg bg-white/5">
      <h2 className="font-semibold mb-3">Your Activity</h2>

      <HeatmapGrid grid={heatmapGrid} />
    </div>
  )
}
