const tasksStore = require("../data/tasks");

// GET /api/tasks
function getAllTasks(req, res) {
  const allTasks = tasksStore.getAll();
  res.status(200).json({
    success: true,
    count: allTasks.length,
    data: allTasks
  });
}

// GET /api/tasks/:id
function getTaskById(req, res) {
  const task = tasksStore.getById(req.taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: `Task with id ${req.taskId} not found.`
    });
  }

  res.status(200).json({ success: true, data: task });
}

// POST /api/tasks
function createTask(req, res) {
  const newTask = tasksStore.create(req.body);
  res.status(201).json({
    success: true,
    message: "Task created successfully.",
    data: newTask
  });
}

// PUT /api/tasks/:id
function updateTask(req, res) {
  const updated = tasksStore.update(req.taskId, req.body);

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: `Task with id ${req.taskId} not found.`
    });
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully.",
    data: updated
  });
}

// DELETE /api/tasks/:id
function deleteTask(req, res) {
  const deleted = tasksStore.remove(req.taskId);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: `Task with id ${req.taskId} not found.`
    });
  }

  res.status(204).send();
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};