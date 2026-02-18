import HeatmapColumn from "./HeatmapColumn"

export default function HeatmapGrid({ grid }) {
  return (
    <div className="flex gap-1 overflow-x-auto">
      {grid.map((week, index) => (
        <HeatmapColumn key={index} week={week} />
      ))}
    </div>
  )
}
