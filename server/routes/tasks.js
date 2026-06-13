const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const DATA_FILE = path.join(__dirname, "../data/tasks.json");

// --- Helpers ---

function readTasks() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf-8");
}

// --- GET /api/tasks ---
// Returns all tasks sorted by createdAt descending (newest first)
// Optional query: ?status=active|completed
router.get("/", (req, res) => {
  let tasks = readTasks();

  const { status, search } = req.query;

  if (status === "active") {
    tasks = tasks.filter((t) => !t.completed);
  } else if (status === "completed") {
    tasks = tasks.filter((t) => t.completed);
  }

  if (search && search.trim()) {
    const query = search.trim().toLowerCase();
    tasks = tasks.filter((t) => t.title.toLowerCase().includes(query));
  }

  // Sort newest first
  tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(tasks);
});

// --- POST /api/tasks ---
// Body: { title (required), description?, dueDate? }
router.post("/", (req, res) => {
  const { title, description, dueDate } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTask = {
    id: uuidv4(),
    title: title.trim(),
    description: description ? description.trim() : "",
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const tasks = readTasks();
  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).json(newTask);
});

// --- PUT /api/tasks/:id ---
// Body: { title?, description?, dueDate? }
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate } = req.body;

  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Title cannot be empty" });
    }
    tasks[index].title = title.trim();
  }

  if (description !== undefined) {
    tasks[index].description = description.trim();
  }

  if (dueDate !== undefined) {
    tasks[index].dueDate = dueDate || null;
  }

  tasks[index].updatedAt = new Date().toISOString();
  writeTasks(tasks);

  res.json(tasks[index]);
});

// --- PATCH /api/tasks/:id/toggle ---
// Toggles the completed status of a task
router.patch("/:id/toggle", (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks[index].completed = !tasks[index].completed;
  tasks[index].updatedAt = new Date().toISOString();
  writeTasks(tasks);

  res.json(tasks[index]);
});

// --- DELETE /api/tasks/:id ---
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const deleted = tasks.splice(taskIndex, 1)[0];
  writeTasks(tasks);

  res.json({ message: "Task deleted", task: deleted });
});

module.exports = router;
