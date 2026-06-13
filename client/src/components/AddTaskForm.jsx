import { useState, useEffect, useRef } from "react";

export default function AddTaskForm({ onAdd, editTask, onUpdate, onCancelEdit }) {
  const isEditing = !!editTask;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const titleRef = useRef(null);

  // Populate fields when editing
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || "");
      setDueDate(editTask.dueDate ? editTask.dueDate.split("T")[0] : "");
      setExpanded(true);
      titleRef.current?.focus();
    }
  }, [editTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      if (isEditing) {
        await onUpdate(editTask.id, { title, description, dueDate: dueDate || null });
        onCancelEdit();
      } else {
        await onAdd({ title, description, dueDate: dueDate || null });
        setTitle("");
        setDescription("");
        setDueDate("");
        setExpanded(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      onCancelEdit();
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setExpanded(false);
      setError("");
    }
  };

  return (
    <div className={`card p-4 transition-all duration-200 ${isEditing ? "ring-2 ring-brand-500" : ""}`}>
      {isEditing && (
        <p className="text-xs font-medium text-brand-500 mb-3 uppercase tracking-wide">
          Editing task
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Title */}
        <div>
          <input
            ref={titleRef}
            type="text"
            placeholder={expanded || isEditing ? "Task title *" : "＋  Add a new task..."}
            value={title}
            onFocus={() => setExpanded(true)}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            className={`input-field text-sm ${error ? "border-red-400 focus:ring-red-400" : ""}`}
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        {/* Expanded fields */}
        {(expanded || isEditing) && (
          <div className="space-y-3 animate-slide-up">
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="input-field text-sm resize-none"
            />
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Due date (optional)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="input-field text-sm w-auto"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-sm"
              >
                {submitting
                  ? "Saving..."
                  : isEditing
                  ? "Save changes"
                  : "Add task"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-ghost text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
