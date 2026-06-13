import { useState } from "react";

function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const [toggling, setToggling] = useState(false);
  const overdue = isOverdue(task.dueDate, task.completed);

  const handleToggle = async () => {
    setToggling(true);
    await onToggle(task.id);
    setToggling(false);
  };

  return (
    <div
      className={`card p-4 flex gap-3 items-start group transition-all duration-200 animate-fade-in
        ${task.completed ? "opacity-60" : ""}
        ${overdue ? "border-l-4 border-l-amber-400" : ""}
      `}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1
          ${task.completed
            ? "bg-emerald-500 border-emerald-500"
            : "border-slate-300 hover:border-brand-500"
          }`}
      >
        {task.completed && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug break-words
          ${task.completed ? "line-through text-slate-400" : "text-slate-800"}`}
        >
          {task.title}
        </p>

        {task.description && (
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Due date badge */}
        {task.dueDate && (
          <span className={`inline-flex items-center gap-1 mt-2 text-xs px-2 py-0.5 rounded-full font-medium
            ${overdue
              ? "bg-amber-100 text-amber-700"
              : task.completed
              ? "bg-slate-100 text-slate-400"
              : "bg-slate-100 text-slate-500"
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {overdue ? "Overdue · " : ""}{formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {/* Actions — visible on hover */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
        <button
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          className="p-1.5 rounded-md text-slate-400 hover:text-brand-500 hover:bg-brand-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(task)}
          aria-label="Delete task"
          className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
