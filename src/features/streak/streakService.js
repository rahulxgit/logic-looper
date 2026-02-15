import { getTodayKey } from "../../utils/dailyReset";

export const updateStreak = () => {
  const today = getTodayKey();
  const lastDate = localStorage.getItem("streakLastDate");
  let streak = Number(localStorage.getItem("streakCount")) || 0;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split("T")[0];

  if (lastDate === yesterdayKey) {
    streak++;
  } else if (lastDate !== today) {
    streak = 1;
  }

  localStorage.setItem("streakCount", streak);
  localStorage.setItem("streakLastDate", today);

  saveHeatmap(today);

  return streak;
};

const saveHeatmap = (date) => {
  const heatmap = JSON.parse(localStorage.getItem("heatmap")) || {};
  heatmap[date] = true;
  localStorage.setItem("heatmap", JSON.stringify(heatmap));
};

export const getStreak = () =>
  Number(localStorage.getItem("streakCount")) || 0;

export const getHeatmap = () =>
  JSON.parse(localStorage.getItem("heatmap")) || {};
