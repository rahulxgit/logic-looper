import dayjs from "dayjs";

// activityMap shape: { "2026-02-14": { solved: true }, ... }
export function calculateStreak(activityMap) {
  let streak = 0;
  let current = dayjs();

  // If today not yet solved, start counting from yesterday
  // (so streak doesn't break mid-day just because you haven't played yet)
  if (!activityMap[current.format("YYYY-MM-DD")]?.solved) {
    current = current.subtract(1, "day");
  }

  // Walk backwards — count consecutive solved days
  while (activityMap[current.format("YYYY-MM-DD")]?.solved) {
    streak++;
    current = current.subtract(1, "day");
  }

  return streak; // 0 if no streak, N for N consecutive days
}

// Streak milestones for badge triggers
export const STREAK_MILESTONES = [7, 14, 30, 60, 100, 365];
