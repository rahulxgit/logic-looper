import { openDB } from "idb";

/**
 * =====================================================
 * DATABASE CONFIG (PRODUCTION READY)
 * =====================================================
 */
const DB_NAME = "logicLooperDB";
const DB_VERSION = 2;

const DAILY_ACTIVITY_STORE = "dailyActivity";
const LEGACY_PROGRESS_STORE = "progress";

/**
 * =====================================================
 * DATABASE INITIALIZATION
 * =====================================================
 * Handles:
 * - fresh install
 * - schema upgrade
 * - backward compatibility
 * - safe migrations
 */
export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion, newVersion, transaction) {
    console.log(`Upgrading DB from v${oldVersion} → v${newVersion}`);

    /**
     * ---------------------------------------
     * CREATE DAILY ACTIVITY STORE (PRODUCTION)
     * ---------------------------------------
     */
    if (!db.objectStoreNames.contains(DAILY_ACTIVITY_STORE)) {
      const store = db.createObjectStore(DAILY_ACTIVITY_STORE, {
        keyPath: "date", // YYYY-MM-DD
      });

      // index for sync queue
      store.createIndex("synced", "synced");
    }

    /**
     * ---------------------------------------
     * LEGACY STORE (COMPATIBILITY)
     * ---------------------------------------
     */
    if (!db.objectStoreNames.contains(LEGACY_PROGRESS_STORE)) {
      db.createObjectStore(LEGACY_PROGRESS_STORE, {
        keyPath: "date",
      });
    }

    /**
     * ---------------------------------------
     * OPTIONAL: MIGRATE OLD DATA → NEW STORE
     * (runs when upgrading from v1)
     * ---------------------------------------
     */
    if (oldVersion < 2 && db.objectStoreNames.contains(LEGACY_PROGRESS_STORE)) {
      try {
        const oldStore = transaction.objectStore(LEGACY_PROGRESS_STORE);
        const newStore = transaction.objectStore(DAILY_ACTIVITY_STORE);

        oldStore.getAll().then((records) => {
          records.forEach((record) => {
            newStore.put({
              solved: false,
              score: 0,
              timeTaken: 0,
              difficulty: 1,
              synced: false,
              ...record,
            });
          });

          console.log("Legacy progress migrated → dailyActivity");
        });
      } catch (err) {
        console.warn("Migration skipped:", err);
      }
    }
  },
});

/**
 * =====================================================
 * INTERNAL HELPER — GET DB INSTANCE
 * =====================================================
 */
async function getDB() {
  return dbPromise;
}

/**
 * =====================================================
 * VALIDATE DAILY ACTIVITY ENTRY
 * =====================================================
 */
function normalizeEntry(entry) {
  if (!entry?.date) {
    throw new Error("Daily activity must contain date (YYYY-MM-DD)");
  }

  return {
    date: entry.date,
    solved: entry.solved ?? false,
    score: entry.score ?? 0,
    timeTaken: entry.timeTaken ?? 0,
    difficulty: entry.difficulty ?? 1,
    synced: entry.synced ?? false,
  };
}

/**
 * =====================================================
 * DAILY ACTIVITY HELPERS
 * =====================================================
 */

/**
 * Save or update activity
 */
export async function saveDailyActivity(entry) {
  try {
    const db = await getDB();
    const normalized = normalizeEntry(entry);

    return db.put(DAILY_ACTIVITY_STORE, normalized);
  } catch (error) {
    console.error("saveDailyActivity error:", error);
    throw error;
  }
}

/**
 * Get activity by date
 */
export async function getActivityByDate(date) {
  try {
    const db = await getDB();
    return db.get(DAILY_ACTIVITY_STORE, date);
  } catch (error) {
    console.error("getActivityByDate error:", error);
    return null;
  }
}

/**
 * Get all activity
 */
export async function getAllActivity() {
  try {
    const db = await getDB();
    return db.getAll(DAILY_ACTIVITY_STORE);
  } catch (error) {
    console.error("getAllActivity error:", error);
    return [];
  }
}

/**
 * Get unsynced activity (offline sync queue)
 */
export async function getUnsyncedActivity() {
  try {
    const db = await getDB();
    const tx = db.transaction(DAILY_ACTIVITY_STORE, "readonly");
    const index = tx.store.index("synced");

    return index.getAll(false);
  } catch (error) {
    console.error("getUnsyncedActivity error:", error);
    return [];
  }
}

/**
 * Mark activity as synced
 */
export async function markActivitySynced(date) {
  try {
    const db = await getDB();
    const data = await db.get(DAILY_ACTIVITY_STORE, date);

    if (!data) return;

    data.synced = true;
    await db.put(DAILY_ACTIVITY_STORE, data);
  } catch (error) {
    console.error("markActivitySynced error:", error);
  }
}

/**
 * =====================================================
 * LEGACY SUPPORT (NO BREAKING CHANGES)
 * =====================================================
 * Existing UI using old APIs will continue working.
 */

/**
 * Save legacy progress → mapped to new model
 */
export async function saveProgress(progressData) {
  return saveDailyActivity(progressData);
}

/**
 * Get legacy progress → mapped
 */
export async function getProgress(date) {
  return getActivityByDate(date);
}

/**
 * Get all legacy progress → mapped
 */
export async function getAllProgress() {
  return getAllActivity();
}
