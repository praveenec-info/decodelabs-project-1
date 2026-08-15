require("dotenv").config();
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

// Importing this triggers database connection + schema creation (database/db.js)
require("./database/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskFlow Backend API is running (Project 3 — Database Integration).",
    endpoints: {
      getAllTasks: "GET /api/tasks",
      getTaskById: "GET /api/tasks/:id",
      createTask: "POST /api/tasks",
      updateTask: "PUT /api/tasks/:id",
      deleteTask: "DELETE /api/tasks/:id"
    }
  });
});

app.use("/api/tasks", taskRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ TaskFlow Backend running on http://localhost:${PORT}`);
  console.log(`✅ Connected to SQLite database (backend/database/tasks.db)`);
});