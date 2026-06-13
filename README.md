# TaskFlow — Personal Task Manager

A full-stack task management app built as a take-home exercise. Users can create, view, update, and delete personal tasks — with filtering, search, overdue highlighting, and persistence across server restarts.


**Live Demo:** https://task-manager-seven-cyan-49.vercel.app

**Backend API:** https://task-manager-api-8c5r.onrender.com

**Repository:** https://github.com/Shree-Singhwal/task-manager

---

## Tech Stack

| Layer    | Technology              | Why                                                   |
| -------- | ----------------------- | ----------------------------------------------------- |
| Frontend | React 18 + Vite         | Fast dev server, functional components with hooks     |
| Styling  | Tailwind CSS            | Utility-first, consistent design tokens               |
| Backend  | Node.js + Express       | Minimal, well-understood REST server                  |
| Storage  | JSON file (tasks.json)  | Zero setup, survives server restarts, easy to inspect |

---

## Features

### Must Have ✅
- Add task with title (required), description and due date (optional)
- View all tasks sorted newest first
- Toggle complete / incomplete
- Edit title, description, due date
- Delete with confirmation prompt
- Filter by All / Active / Completed

### Should Have ✅
- Active vs completed count in the header
- Overdue tasks highlighted with an amber left border + badge
- Empty state UI for each filter view

### Bonus ✅
- Search tasks by title (debounced, 300 ms)
- Tasks persist across server restarts (written to `server/data/tasks.json`)

---


## What Works / What Doesn't

### Working Features ✅

* Create tasks with title, description, and due date
* View all tasks sorted newest first
* Edit existing tasks
* Toggle completed/incomplete status
* Delete tasks with confirmation
* Filter tasks by All / Active / Completed
* Search tasks by title (debounced)
* Active and completed task counters
* Overdue task highlighting
* Empty state UI
* Data persistence using JSON storage
* Responsive UI
* Frontend deployed on Vercel
* Backend deployed on Render

### Known Limitations ⚠️

* Render free tier may take a few seconds to wake up after inactivity
* Drag-and-drop reordering is not implemented
* Database is file-based (JSON) rather than SQL/NoSQL
* No user authentication or multi-user support

---

## Deployment

### Frontend

Hosted on Vercel:

https://task-manager-seven-cyan-49.vercel.app

### Backend

Hosted on Render:

https://task-manager-api-8c5r.onrender.com

### Environment Variable

Frontend requires:

```env
VITE_API_URL=https://task-manager-api-8c5r.onrender.com/api
```

---
## Testing

Backend API routes were tested using **Jest** and **Supertest**.

Run tests locally:

```bash
cd server
npm test
```

Covered scenarios:

* Fetching tasks
* Task creation validation
* Task updates
* Toggle completion
* Task deletion
* Error handling (400 / 404 responses)

---
## How to Run Locally

> Requires **Node.js 18+**. No other tools needed.

```bash
# 1. Clone the repo
git clone https://github.com/Shree Singhwal/task-manager.git
cd task-manager

# 2. Install all dependencies (root + server + client)
npm run install:all

# 3. Start both server and client together
npm run dev
```

- **Frontend** → http://localhost:3000  
- **Backend** → http://localhost:5000

Or run them separately:
```bash
# Terminal 1 – backend
cd server && npm run dev

# Terminal 2 – frontend
cd client && npm run dev
```

---

## API Documentation

Base URL: `http://localhost:5000/api`

### GET `/tasks`
Returns all tasks, newest first.

| Query param | Type   | Description                        |
| ----------- | ------ | ---------------------------------- |
| `status`    | string | `active` or `completed` to filter  |
| `search`    | string | Filter by title substring          |

**Response** `200`
```json
[
  {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "dueDate": "2025-06-20",
    "completed": false,
    "createdAt": "2025-06-13T10:00:00.000Z",
    "updatedAt": "2025-06-13T10:00:00.000Z"
  }
]
```

---

### POST `/tasks`
Create a new task.

**Body**
```json
{ "title": "string (required)", "description": "string", "dueDate": "YYYY-MM-DD" }
```

**Response** `201` — the created task object  
**Response** `400` — `{ "error": "Title is required" }`

---

### PUT `/tasks/:id`
Update a task's title, description, or due date.

**Body** (all fields optional)
```json
{ "title": "string", "description": "string", "dueDate": "YYYY-MM-DD or null" }
```

**Response** `200` — updated task object  
**Response** `404` — `{ "error": "Task not found" }`

---

### PATCH `/tasks/:id/toggle`
Toggle the `completed` status of a task.

**Response** `200` — updated task object  
**Response** `404` — `{ "error": "Task not found" }`

---

### DELETE `/tasks/:id`
Delete a task permanently.

**Response** `200` — `{ "message": "Task deleted", "task": { ... } }`  
**Response** `404` — `{ "error": "Task not found" }`

---

## Project Structure

```
task-manager/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddTaskForm.jsx      # Add & edit form (expands on focus)
│   │   │   ├── TaskCard.jsx         # Single task row with hover actions
│   │   │   ├── FilterBar.jsx        # All/Active/Completed + search input
│   │   │   ├── StatsBar.jsx         # Active/completed counts in header
│   │   │   └── DeleteConfirmModal.jsx  # Confirmation dialog
│   │   ├── hooks/
│   │   │   └── useTasks.js          # All API calls + local state
│   │   ├── App.jsx                  # Root component, layout, modal control
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Tailwind directives + custom utilities
│   ├── index.html
│   ├── vite.config.js               # Dev proxy → localhost:5000
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                  # Express backend
│   ├── routes/
│   │   └── tasks.js                 # All task CRUD routes
│   ├── data/
│   │   └── tasks.json               # Persisted task data (auto-created)
│   ├── index.js                     # Express app setup
│   └── package.json
│
├── package.json             # Root: concurrently dev script
└── README.md
```

---

## Next Steps

With more time, I would:

1. **Drag-and-drop reordering** — `@hello-pangea/dnd` is already installed, just needs a `position` field on tasks and a `PATCH /tasks/reorder` endpoint
2. **Unit tests** — Jest + Supertest for the Express routes (happy path + 400/404 cases)
3. **SQLite storage** — swap the JSON file for `better-sqlite3`; the route handlers would change minimally since reads/writes are synchronous
4. **Optimistic UI for edits** — currently the list re-fetches after every mutation; could update local state immediately for snappier feel
5. **Keyboard shortcuts** — `N` to focus the add form, `Escape` to close modals
6. **Due-date picker** — replace `<input type="date">` with a proper calendar popover for better mobile UX

---



## Author

Shree Singhwal  
GitHub: [@Shree-Singhwal](https://github.com/

LinkedIn: https://www.linkedin.com/in/shree-singhwalShree-Singhwal)
