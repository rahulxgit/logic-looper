import { useState } from "react";

export default function useHint(limit = 3) {
  const [hintsLeft, setHintsLeft] = useState(
    Number(localStorage.getItem("hintsUsed")) || 0
  );

  const useHint = () => {
    if (hintsLeft >= limit) return false;

    const newCount = hintsLeft + 1;
    setHintsLeft(newCount);
    localStorage.setItem("hintsUsed", newCount);
    return true;
  };

  return {
    hintsLeft: limit - hintsLeft,
    useHint,
  };
}
