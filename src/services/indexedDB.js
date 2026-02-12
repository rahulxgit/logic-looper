import { openDB } from "idb";

const DB_NAME = "logicLooperDB";
const STORE_NAME = "progress";
const DB_VERSION = 1;

// Initialize DB
export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "date" });
      }
    },
  });
}

// Save daily progress
export async function saveProgress(progressData) {
  const db = await initDB();
  await db.put(STORE_NAME, progressData);
}

// Get progress by date
export async function getProgress(date) {
  const db = await initDB();
  return db.get(STORE_NAME, date);
}

// Get all progress
export async function getAllProgress() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}
