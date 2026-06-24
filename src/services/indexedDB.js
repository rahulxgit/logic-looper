import { openDB } from "idb";

const DB_NAME = "logic-looper";
const DB_VERSION = 1;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("dailyActivity")) {
      db.createObjectStore("dailyActivity", { keyPath: "date" });
    }
    if (!db.objectStoreNames.contains("puzzleProgress")) {
      db.createObjectStore("puzzleProgress", { keyPath: "date" });
    }
    if (!db.objectStoreNames.contains("achievements")) {
      db.createObjectStore("achievements", { keyPath: "id" });
    }
  }
});

export async function getDB() {
  return dbPromise;
}

// ── Daily Activity CRUD ──

export async function saveActivity(entry) {
  const db = await getDB();
  await db.put("dailyActivity", entry);
  window.dispatchEvent(new Event("activityUpdated"));
}

export async function getActivityByDate(date) {
  const db = await getDB();
  return db.get("dailyActivity", date);
}

export async function getAllActivity() {
  const db = await getDB();
  return db.getAll("dailyActivity");
}

export async function markSynced(date) {
  const db = await getDB();
  const record = await db.get("dailyActivity", date);
  if (record) {
    await db.put("dailyActivity", { ...record, synced: true });
    window.dispatchEvent(new Event("activityUpdated"));
  }
}

// ── Progress CRUD (auto-save mid-puzzle) ──

export async function savePuzzleProgress(date, state) {
  const db = await getDB();
  await db.put("puzzleProgress", { date, ...state });
}

export async function getPuzzleProgress(date) {
  const db = await getDB();
  return db.get("puzzleProgress", date);
}

export async function clearPuzzleProgress(date) {
  const db = await getDB();
  await db.delete("puzzleProgress", date);
}

// ── Support exports to avoid breaking changes in components ──

export async function saveDailyActivity(entry) {
  return saveActivity(entry);
}
