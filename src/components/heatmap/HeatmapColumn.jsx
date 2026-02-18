import HeatmapCell from "./HeatmapCell"

export default function HeatmapColumn({ week }) {
  return (
    <div className="flex flex-col gap-1">
      {week.map((day) => (
        <HeatmapCell key={day.date} dayData={day} />
      ))}
    </div>
  )
}
