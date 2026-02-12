import express from "express";
import cors from "cors";

import { PrismaClient } from "@prisma/client";



const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// Create user
app.post("/user", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.create({
      data: { email },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "User creation failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
