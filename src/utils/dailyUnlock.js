import dayjs from "dayjs";

// Today's date in local timezone — NEVER use server date for this
export function getTodayKey() {
  return dayjs().format("YYYY-MM-DD");
}

// Check if a given date is unlocked (playable)
export function isUnlocked(dateKey, activityMap) {
  const today = getTodayKey();
  if (dateKey === today) return true;              // today always unlocked
  if (dateKey > today) return false;               // future — never unlocked

  // Past day: unlocked only if completed (so user can review)
  return activityMap[dateKey]?.solved === true;
}

// Check if today's puzzle already completed
export function isTodayCompleted(activityMap) {
  return activityMap[getTodayKey()]?.solved === true;
}
