import { useState } from "react";

export default function useHint(limit = 3) {
  // Initialize from used count (reset daily by checkDailyReset)
  const [hintsUsed, setHintsUsed] = useState(
    Number(localStorage.getItem("hintsUsed")) || 0
  );

  const useHintAction = () => {
    if (hintsUsed >= limit) return false;

    const newUsed = hintsUsed + 1;
    setHintsUsed(newUsed);
    localStorage.setItem("hintsUsed", newUsed);
    return true;
  };

  return {
    hintsLeft: limit - hintsUsed,
    hintsUsed,
    useHint: useHintAction,
  };
}
