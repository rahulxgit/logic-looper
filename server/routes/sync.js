import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

router.post("/daily-scores", authMiddleware, async (req, res) => {
  const { entries } = req.body;
  // entries = [{ date: "2026-02-14", score: 120, timeTaken: 45 }]
  const userId = req.user.id;

  if (!entries || !Array.isArray(entries)) {
    return res.status(400).json({ error: "Invalid entries format" });
  }

  try {
    for (const entry of entries) {
      // ── Security Rule 1: Reject future dates ──
      const entryDate = new Date(entry.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (entryDate > today) {
        return res.status(400).json({ error: "Future dates rejected" });
      }

      // ── Security Rule 2: Invalid score range ──
      if (entry.score < 0 || entry.score > 250) {
        return res.status(400).json({ error: "Score out of valid range (0–250)" });
      }

      // ── Security Rule 3: Unrealistic completion time ──
      if (entry.timeTaken < 5 || entry.timeTaken > 3600) {
        return res.status(400).json({ error: "Completion time not realistic" });
      }

      // Prisma upsert: insert if not exists, update if exists
      // @@unique([userId, date]) prevents duplicates at DB level too
      await prisma.dailyScore.upsert({
        where: {
          userId_date: { userId, date: entryDate }
        },
        update: {
          score: entry.score,
          timeTaken: entry.timeTaken
        },
        create: {
          userId,
          date: entryDate,
          puzzleId: entry.date,
          score: entry.score,
          timeTaken: entry.timeTaken
        }
      });
    }

    res.json({ success: true, synced: entries.length });
  } catch (err) {
    console.error("Sync error:", err);
    res.status(500).json({ error: "Sync failed" });
  }
});

export default router;
