import { useState, useCallback } from "react";
import { useTasks } from "./hooks/useTasks";
import AddTaskForm from "./components/AddTaskForm";
import TaskCard from "./components/TaskCard";
import FilterBar from "./components/FilterBar";
import StatsBar from "./components/StatsBar";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

function EmptyState({ filter, searchQuery }) {
  const messages = {
    all: {
      icon: "📋",
      title: "No tasks yet",
      sub: "Add your first task above to get started.",
    },
    active: {
      icon: "✅",
      title: "Nothing active",
      sub: "All tasks are completed. Great work!",
    },
    completed: {
      icon: "🎯",
      title: "No completed tasks",
      sub: "Complete a task and it'll show up here.",
    },
  };

  if (searchQuery) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-slate-700 font-medium">No results for "{searchQuery}"</p>
        <p className="text-slate-400 text-sm mt-1">Try a different keyword.</p>
      </div>
    );
  }

  const { icon, title, sub } = messages[filter] || messages.all;
  return (
    <div className="text-center py-16">
      <p className="text-4xl mb-3">{icon}</p>
      <p className="text-slate-700 font-medium">{title}</p>
      <p className="text-slate-400 text-sm mt-1">{sub}</p>
    </div>
  );
}

export default function App() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { tasks, loading, error, stats, addTask, updateTask, toggleTask, deleteTask } =
    useTasks(filter, searchQuery);

  const handleSearchChange = useCallback((q) => setSearchQuery(q), []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteTask(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-slate-900">TaskFlow</h1>
          </div>
          <StatsBar stats={stats} />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Add / Edit form */}
        <AddTaskForm
          onAdd={addTask}
          editTask={editTask}
          onUpdate={updateTask}
          onCancelEdit={() => setEditTask(null)}
        />

        {/* Filter + Search */}
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          onSearchChange={handleSearchChange}
        />

        {/* Task list */}
        <div className="space-y-2">
          {loading && (
            <div className="text-center py-12">
              <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-slate-400 text-sm mt-3">Loading tasks...</p>
            </div>
          )}

          {error && (
            <div className="card p-4 border-red-200 bg-red-50 text-red-700 text-sm">
              ⚠️ {error} —{" "}
              <button className="underline" onClick={() => window.location.reload()}>
                retry
              </button>
            </div>
          )}

          {!loading && !error && tasks.length === 0 && (
            <EmptyState filter={filter} searchQuery={searchQuery} />
          )}

          {!loading &&
            !error &&
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={setEditTask}
                onDelete={setDeleteTarget}
              />
            ))}
        </div>
      </main>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          taskTitle={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
