import { openDB } from "idb"

/**
 * =====================================================
 * DATABASE CONFIG (PRODUCTION READY)
 * =====================================================
 */
const DB_NAME = "logicLooperDB"
const DB_VERSION = 2

const DAILY_ACTIVITY_STORE = "dailyActivity"
const LEGACY_PROGRESS_STORE = "progress"

/**
 * =====================================================
 * GLOBAL REAL-TIME EVENT SYSTEM
 * =====================================================
 *
 * Ensures:
 * - navbar updates
 * - heatmap refresh
 * - streak refresh
 * - cross component sync
 * - cross tab sync
 * - background sync trigger
 */

function notifyActivityUpdate(payload = {}) {
  // in-app refresh
  window.dispatchEvent(
    new CustomEvent("activityUpdated", { detail: payload })
  )

  // cross-tab sync
  localStorage.setItem(
    "__activity_sync__",
    JSON.stringify({ time: Date.now() })
  )
}

/**
 * =====================================================
 * LISTEN FOR CROSS TAB UPDATES
 * =====================================================
 */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "__activity_sync__") {
      window.dispatchEvent(new Event("activityUpdated"))
    }
  })
}

/**
 * =====================================================
 * DATABASE INITIALIZATION
 * =====================================================
 */
export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion, newVersion, transaction) {
    console.log(`Upgrading DB from v${oldVersion} → v${newVersion}`)

    /**
     * CREATE DAILY ACTIVITY STORE
     */
    if (!db.objectStoreNames.contains(DAILY_ACTIVITY_STORE)) {
      const store = db.createObjectStore(DAILY_ACTIVITY_STORE, {
        keyPath: "date",
      })

      store.createIndex("synced", "synced")
    }

    /**
     * LEGACY STORE
     */
    if (!db.objectStoreNames.contains(LEGACY_PROGRESS_STORE)) {
      db.createObjectStore(LEGACY_PROGRESS_STORE, {
        keyPath: "date",
      })
    }

    /**
     * MIGRATE OLD DATA
     */
    if (oldVersion < 2 && db.objectStoreNames.contains(LEGACY_PROGRESS_STORE)) {
      try {
        const oldStore = transaction.objectStore(LEGACY_PROGRESS_STORE)
        const newStore = transaction.objectStore(DAILY_ACTIVITY_STORE)

        oldStore.getAll().then((records) => {
          records.forEach((record) => {
            newStore.put({
              solved: false,
              score: 0,
              timeTaken: 0,
              difficulty: 1,
              synced: false,
              ...record,
            })
          })
        })
      } catch (err) {
        console.warn("Migration skipped:", err)
      }
    }
  },
})

/**
 * =====================================================
 * INTERNAL HELPER
 * =====================================================
 */
async function getDB() {
  return dbPromise
}

/**
 * =====================================================
 * VALIDATE + NORMALIZE ENTRY
 * =====================================================
 */
function normalizeEntry(entry) {
  if (!entry?.date) {
    throw new Error("Daily activity must contain date (YYYY-MM-DD)")
  }

  return {
    date: entry.date,
    solved: Boolean(entry.solved),
    score: entry.score ?? 0,
    timeTaken: entry.timeTaken ?? 0,
    difficulty: entry.difficulty ?? 1,
    synced: entry.synced ?? false,
  }
}

/**
 * =====================================================
 * SAFE TRANSACTION WRAPPER
 * =====================================================
 */
async function safeTransaction(store, mode, callback) {
  const db = await getDB()
  const tx = db.transaction(store, mode)

  try {
    const result = await callback(tx.store)
    await tx.done
    return result
  } catch (err) {
    tx.abort()
    throw err
  }
}

/**
 * =====================================================
 * DAILY ACTIVITY HELPERS
 * =====================================================
 */

/**
 * Save or update activity
 * - safe write
 * - merges existing data
 * - triggers UI update
 */
export async function saveDailyActivity(entry) {
  try {
    const normalized = normalizeEntry(entry)

    const result = await safeTransaction(
      DAILY_ACTIVITY_STORE,
      "readwrite",
      async (store) => {
        const existing = await store.get(normalized.date)

        const merged = {
          ...existing,
          ...normalized,
          synced: false, // always mark unsynced for queue
        }

        await store.put(merged)
        return merged
      }
    )

    notifyActivityUpdate(result)
    return result
  } catch (error) {
    console.error("saveDailyActivity error:", error)
    throw error
  }
}

/**
 * Batch save (performance optimization)
 */
export async function saveDailyActivityBatch(entries = []) {
  if (!entries.length) return

  await safeTransaction(DAILY_ACTIVITY_STORE, "readwrite", async (store) => {
    for (const entry of entries) {
      const normalized = normalizeEntry(entry)
      await store.put(normalized)
    }
  })

  notifyActivityUpdate()
}

/**
 * Get activity by date
 */
export async function getActivityByDate(date) {
  try {
    return safeTransaction(
      DAILY_ACTIVITY_STORE,
      "readonly",
      (store) => store.get(date)
    )
  } catch (error) {
    console.error("getActivityByDate error:", error)
    return null
  }
}

/**
 * Get all activity
 */
export async function getAllActivity() {
  try {
    return safeTransaction(
      DAILY_ACTIVITY_STORE,
      "readonly",
      (store) => store.getAll()
    )
  } catch (error) {
    console.error("getAllActivity error:", error)
    return []
  }
}

/**
 * Delete activity
 */
export async function deleteActivity(date) {
  await safeTransaction(DAILY_ACTIVITY_STORE, "readwrite", (store) =>
    store.delete(date)
  )

  notifyActivityUpdate()
}

/**
 * Clear all activity (debug / reset)
 */
export async function clearAllActivity() {
  await safeTransaction(DAILY_ACTIVITY_STORE, "readwrite", (store) =>
    store.clear()
  )

  notifyActivityUpdate()
}

/**
 * =====================================================
 * OFFLINE SYNC QUEUE
 * =====================================================
 */

/**
 * Get unsynced activity
 */
export async function getUnsyncedActivity() {
  try {
    return safeTransaction(DAILY_ACTIVITY_STORE, "readonly", (store) =>
      store.index("synced").getAll(false)
    )
  } catch (error) {
    console.error("getUnsyncedActivity error:", error)
    return []
  }
}

/**
 * Mark activity synced
 */
export async function markActivitySynced(date) {
  try {
    await safeTransaction(DAILY_ACTIVITY_STORE, "readwrite", async (store) => {
      const data = await store.get(date)
      if (!data) return

      data.synced = true
      await store.put(data)
    })

    notifyActivityUpdate({ date, synced: true })
  } catch (error) {
    console.error("markActivitySynced error:", error)
  }
}

/**
 * =====================================================
 * LEGACY SUPPORT (NO BREAKING CHANGES)
 * =====================================================
 */

export async function saveProgress(progressData) {
  return saveDailyActivity(progressData)
}

export async function getProgress(date) {
  return getActivityByDate(date)
}

export async function getAllProgress() {
  return getAllActivity()
}

/**
 * COMPATIBILITY WRAPPER
 */
export async function saveActivity(activity) {
  return saveDailyActivity(activity)
}
