import { openDB } from "idb";

export async function saveProgress(data) {
  const db = await openDB("logicLooperDB", 1, {
    upgrade(db) {
      db.createObjectStore("progress", { keyPath: "date" });
    },
  });

  await db.put("progress", data);
}
