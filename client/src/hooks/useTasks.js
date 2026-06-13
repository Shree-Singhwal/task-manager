import { useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export function useTasks(filter, searchQuery) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filter && filter !== "all") params.set("status", filter);
      if (searchQuery && searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`${API_BASE}/tasks?${params}`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, searchQuery]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async ({ title, description, dueDate }) => {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, dueDate }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to add task");
    }
    await fetchTasks();
  };

  const updateTask = async (id, { title, description, dueDate }) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, dueDate }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update task");
    }
    await fetchTasks();
  };

  const toggleTask = async (id) => {
    const res = await fetch(`${API_BASE}/tasks/${id}/toggle`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to toggle task");
    // Optimistic update for snappy feel
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    // Re-sync to get accurate state
    await fetchTasks();
  };

  const deleteTask = async (id) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete task");
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  return { tasks, loading, error, stats, addTask, updateTask, toggleTask, deleteTask, refetch: fetchTasks };
}
