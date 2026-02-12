import dayjs from "dayjs";

const types = ["number", "pattern", "sequence", "deduction", "binary"];

export function getTodayPuzzleType() {
  const index = dayjs().day() % types.length;
  return types[index];
}
