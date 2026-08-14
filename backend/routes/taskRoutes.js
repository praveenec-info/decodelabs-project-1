const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const {
  validateTaskCreate,
  validateTaskUpdate,
  validateIdParam
} = require("../middleware/validateTask");

// RESTful routes — resources are nouns, methods are verbs
router.get("/", getAllTasks);
router.get("/:id", validateIdParam, getTaskById);
router.post("/", validateTaskCreate, createTask);
router.put("/:id", validateIdParam, validateTaskUpdate, updateTask);
router.delete("/:id", validateIdParam, deleteTask);

module.exports = router;