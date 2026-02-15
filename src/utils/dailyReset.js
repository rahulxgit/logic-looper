export const getTodayKey = () => {
  return new Date().toISOString().split("T")[0];
};

export const checkDailyReset = () => {
  const today = getTodayKey();
  const lastPlayed = localStorage.getItem("lastPlayed");

  if (lastPlayed !== today) {
    localStorage.setItem("lastPlayed", today);

    // reset daily progress
    localStorage.removeItem("currentScore");
    localStorage.removeItem("hintsUsed");
  }
};
