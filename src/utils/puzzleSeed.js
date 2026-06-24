import CryptoJS from "crypto-js";

// We'll use a hardcoded fallback if process.env.REACT_APP_PUZZLE_SECRET is missing,
// but for Vite it's import.meta.env.VITE_PUZZLE_SECRET.
const SECRET_KEY = import.meta.env?.VITE_REACT_APP_PUZZLE_SECRET || "default_secret_key";

// Step 1: Generate deterministic seed from today's date
export function getPuzzleSeed(date) {
  // date format: "2026-02-14"
  const raw = `${date}:${SECRET_KEY}`;
  const hash = CryptoJS.SHA256(raw).toString(); // 64-char hex string
  // Take first 8 hex chars → convert to integer → use as PRNG seed
  return parseInt(hash.substring(0, 8), 16);
}

// Step 2: Seeded PRNG (Linear Congruential Generator)
// Same seed → same sequence of "random" numbers → same puzzle
export function seededRandom(seed) {
  let s = seed;
  return function() {
    // LCG formula: standard constants from Numerical Recipes
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff; // normalize to [0, 1)
  };
}
