import { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";
dayjs.extend(isLeapYear);
import { getAllActivity } from "../../services/indexedDB";

const intensityClass = {
  0: "bg-gray-200 dark:bg-gray-700",
  1: "bg-green-200",
  2: "bg-green-400",
  3: "bg-green-600",
  4: "bg-green-800"
};

function getIntensity(activity) {
  if (!activity?.solved) return 0;
  if (activity.score >= 100 && activity.difficulty === "hard") return 4;
  if (activity.difficulty === "hard") return 3;
  if (activity.difficulty === "medium") return 2;
  return 1;
}

export function Heatmap({ activityMap }) {
  const { weeks } = useMemo(() => {
    const start = dayjs().startOf("year");
    const total = dayjs().isLeapYear() ? 366 : 365;
    const today = dayjs().format("YYYY-MM-DD");

    const cells = [];
    for (let i = 0; i < total; i++) {
      const date = start.add(i, "day");
      const key = date.format("YYYY-MM-DD");
      cells.push({
        date: key,
        label: date.format("MMM D"),
        isToday: key === today,
        activity: activityMap[key]
      });
    }

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    return { cells, weeks };
  }, [activityMap]);

  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map(({ date, label, isToday, activity }) => (
            <div
              key={date}
              title={`${label}: Score ${activity?.score ?? 0}`}
              style={{
                transition: "all 0.15s"
              }}
              className={`
                w-3 h-3 rounded-sm cursor-pointer
                ${intensityClass[getIntensity(activity)]}
                ${isToday ? "ring-2 ring-indigo-500" : ""}
                hover:scale-125 hover:z-10
              `}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function HeatmapContainer() {
  const [activityMap, setActivityMap] = useState({});
  const [loading, setLoading] = useState(true);

  const loadActivity = async () => {
    try {
      setLoading(true);
      const data = await getAllActivity();
      const map = {};
      data.forEach(item => {
        map[item.date] = item;
      });
      setActivityMap(map);
    } catch (err) {
      console.error("Failed to load activity:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivity();
    window.addEventListener("activityUpdated", loadActivity);
    return () => {
      window.removeEventListener("activityUpdated", loadActivity);
    };
  }, []);

  if (loading) {
    return (
      <div className="p-4 border border-white/20 rounded-lg bg-white/5">
        <p className="text-sm opacity-70">Loading activity...</p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-white/20 rounded-lg bg-white/5">
      <Heatmap activityMap={activityMap} />
    </div>
  );
}
