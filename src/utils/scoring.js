// Score formula as per internship spec
export function calculateScore({ difficulty = "medium", timeTaken, hintsUsed = 0 }) {
  const BASE_SCORES = { easy: 50, medium: 100, hard: 200 };
  const baseScore = BASE_SCORES[difficulty] || 100;

  // Time multiplier: full score if < 60s, decreases linearly to 0.5x at 5 min
  const timeMultiplier = Math.max(0.5, 1 - (timeTaken / 300));

  // Each hint costs 10 points
  const hintPenalty = hintsUsed * 10;

  return Math.max(0, Math.round(baseScore * timeMultiplier - hintPenalty));
}
