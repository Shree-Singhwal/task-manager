const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../index");

const DATA_FILE = path.join(__dirname, "../data/tasks.json");

beforeEach(() => {
  fs.writeFileSync(DATA_FILE, "[]", "utf-8");
});

afterAll(() => {
  fs.writeFileSync(DATA_FILE, "[]", "utf-8");
});

describe("GET /api/tasks", () => {
  it("returns empty array when no tasks", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns tasks sorted newest first", async () => {
    await request(app).post("/api/tasks").send({ title: "First" });
    await request(app).post("/api/tasks").send({ title: "Second" });
    const res = await request(app).get("/api/tasks");
    expect(res.body[0].title).toBe("Second");
  });

  it("filters by status=active", async () => {
    const created = await request(app).post("/api/tasks").send({ title: "Task A" });
    await request(app).post("/api/tasks").send({ title: "Task B" });
    await request(app).patch(`/api/tasks/${created.body.id}/toggle`);
    const res = await request(app).get("/api/tasks?status=active");
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Task B");
  });

  it("filters by search query", async () => {
    await request(app).post("/api/tasks").send({ title: "Buy groceries" });
    await request(app).post("/api/tasks").send({ title: "Read a book" });
    const res = await request(app).get("/api/tasks?search=groceries");
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Buy groceries");
  });
});

describe("POST /api/tasks", () => {
  it("creates a task with only title", async () => {
    const res = await request(app).post("/api/tasks").send({ title: "My task" });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("My task");
    expect(res.body.completed).toBe(false);
  });

  it("returns 400 when title is missing", async () => {
    const res = await request(app).post("/api/tasks").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Title is required");
  });

  it("returns 400 when title is empty string", async () => {
    const res = await request(app).post("/api/tasks").send({ title: "   " });
    expect(res.statusCode).toBe(400);
  });
});

describe("PATCH /api/tasks/:id/toggle", () => {
  it("toggles task to completed", async () => {
    const created = await request(app).post("/api/tasks").send({ title: "Toggle me" });
    const res = await request(app).patch(`/api/tasks/${created.body.id}/toggle`);
    expect(res.body.completed).toBe(true);
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app).patch("/api/tasks/bad-id/toggle");
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /api/tasks/:id", () => {
  it("deletes a task", async () => {
    const created = await request(app).post("/api/tasks").send({ title: "Delete me" });
    const res = await request(app).delete(`/api/tasks/${created.body.id}`);
    expect(res.statusCode).toBe(200);
    const list = await request(app).get("/api/tasks");
    expect(list.body).toHaveLength(0);
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app).delete("/api/tasks/bad-id");
    expect(res.statusCode).toBe(404);
  });
});