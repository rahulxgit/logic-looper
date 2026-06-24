import { auth } from "../services/firebase";

export async function syncScoresToServer(entries) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user");
    }

    const token = await user.getIdToken();
    const response = await fetch("http://localhost:5000/sync/daily-scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ entries })
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
