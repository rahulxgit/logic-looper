import CryptoJS from "crypto-js"

function createGridFromHash(hash) {
  const values = hash
    .slice(0, 16)
    .split("")
    .map((char) => Number.parseInt(char, 16) % 2)

  return Array.from({ length: 4 }, (_, row) =>
    values.slice(row * 4, row * 4 + 4)
  )
}

function generateSolution(hash) {
  return hash.slice(16, 24)
}

export function generatePuzzle(seed) {
  const hash = CryptoJS.SHA256(String(seed)).toString()

  return {
    grid: createGridFromHash(hash),
    solution: generateSolution(hash),
  }
}
