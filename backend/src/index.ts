import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Get all tasks
app.get("/tasks", async (_req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Create a task
app.post("/tasks", async (req, res) => {
  try {
    const { title, client, dayOfWeek, status } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        client,
        dayOfWeek,
        status: status ?? "planned",
      },
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Update a task
app.put("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, client, dayOfWeek, status } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        client,
        dayOfWeek,
        status,
      },
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
