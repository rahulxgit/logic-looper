import dayjs from "dayjs";
import CryptoJS from "crypto-js";

export function getDailySeed() {
  const today = dayjs().format("YYYY-MM-DD");
  return CryptoJS.SHA256(today).toString();
}
