import { useEffect } from "react";
import { getAllActivity, markSynced } from "../services/indexedDB";
import { syncScoresToServer } from "../api/sync";

export function useBackgroundSync(user) {
  useEffect(() => {
    // Only sync if logged in (guest mode: local only)
    if (!user) return;

    async function sync() {
      const allActivity = await getAllActivity();
      // Find entries that haven't been synced yet
      const unsynced = allActivity.filter(a => a.solved && !a.synced);
      if (unsynced.length === 0) return;

      try {
        const entries = unsynced.map(a => ({
          date: a.date,
          score: a.score,
          timeTaken: a.timeTaken
        }));

        const result = await syncScoresToServer(entries);

        if (result && result.success) {
          // Mark each as synced in IndexedDB
          for (const entry of unsynced) {
            await markSynced(entry.date);
          }
          console.log(`Synced ${unsynced.length} entries`);
        }
      } catch (err) {
        console.warn("Sync failed, will retry on next connection", err);
      }
    }

    // Sync on mount (app open)
    sync();

    // Sync when internet reconnects
    window.addEventListener("online", sync);
    return () => window.removeEventListener("online", sync);
  }, [user]);
}
