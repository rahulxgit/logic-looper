export const calculateScore = ({
  timeTaken,
  hintsUsed,
  baseScore = 100,
}) => {
  const timePenalty = Math.floor(timeTaken / 5);
  const hintPenalty = hintsUsed * 10;

  const score = baseScore - timePenalty - hintPenalty;

  localStorage.setItem("currentScore", score);

  return Math.max(score, 0);
};
