import { useEffect } from "react"
import { getAllActivity } from "../services/indexedDB"
import { buildHeatmapGrid } from "../services/heatmapService"

export default function TestHeatmap() {
  useEffect(() => {
    async function testHeatmap() {
      const activity = await getAllActivity()
      const grid = buildHeatmapGrid(activity)

      console.log("✅ HEATMAP GRID:", grid)
    }

    testHeatmap()
  }, [])

  return null // nothing renders
}
