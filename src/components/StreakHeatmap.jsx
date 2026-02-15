import { getHeatmap } from "../features/streak/streakService";

function StreakHeatmap() {
  const data = getHeatmap();

  const days = Object.keys(data).slice(-30);

  return (
    <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
      {days.map((day) => (
        <div
          key={day}
          style={{
            width: 15,
            height: 15,
            background: data[day] ? "green" : "#ddd",
            borderRadius: 3,
          }}
        />
      ))}
    </div>
  );
}

export default StreakHeatmap;
