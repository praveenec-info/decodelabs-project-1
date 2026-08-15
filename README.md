# decodelabs-project-1

Full stack task manager built as part of my Full Stack internship at DecodeLabs.

## Structure
- `index.html`, `style.css`, `script.js` — Project 1: Frontend (vanilla HTML/CSS/JS)
- `backend/` — Project 2: Backend REST API (Node.js + Express)

## Running locally

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Server runs at `http://localhost:5000`

**Frontend:**
Open `index.html` with Live Server (VS Code extension) or any static server.
Make sure the backend is running first — the frontend fetches tasks from it.

## API Endpoints
| Method | Endpoint          | Description         |
|--------|-------------------|----------------------|
| GET    | /api/tasks        | Get all tasks        |
| GET    | /api/tasks/:id    | Get a single task    |
| POST   | /api/tasks        | Create a new task    |
| PUT    | /api/tasks/:id    | Update a task        |
| DELETE | /api/tasks/:id    | Delete a task        |