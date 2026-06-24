import { auth } from "../services/firebase";

const SYNC_URL = import.meta.env.VITE_SYNC_URL;

export async function syncScoresToServer(entries) {
  // If no server URL is configured, skip sync silently
  if (!SYNC_URL) {
    console.log("Sync skipped: VITE_SYNC_URL not configured");
    return null;
  }

  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user");
    }

    const token = await user.getIdToken();
    const response = await fetch(`${SYNC_URL}/sync/daily-scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ entries }),
    });

    if (!response.ok) {
      throw new Error("Failed to sync data to server");
    }

    return await response.json();
  } catch (error) {
    console.error("API sync error", error);
    throw error;
  }
}
