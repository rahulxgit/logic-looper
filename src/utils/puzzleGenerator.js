// utils/puzzleGenerator.js
import CryptoJS from "crypto-js";

export function generatePuzzle(seed) {
  const hash = CryptoJS.SHA256(seed).toString();
  
  // Use hash to generate deterministic puzzle
  return {
    grid: createGridFromHash(hash),
    solution: generateSolution(hash)
  };
}
