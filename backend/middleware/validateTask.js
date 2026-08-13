// Gatekeeper: validate incoming task data before it touches the "brain"

const VALID_PRIORITIES = ["low", "normal", "high"];

function validateTaskCreate(req, res, next) {
  const { text, priority } = req.body;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed: 'text' is required and must be a non-empty string."
    });
  }

  if (text.length > 120) {
    return res.status(400).json({
      success: false,
      message: "Validation failed: 'text' must be under 120 characters."
    });
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: `Validation failed: 'priority' must be one of ${VALID_PRIORITIES.join(", ")}.`
    });
  }

  next();
}

function validateTaskUpdate(req, res, next) {
  const { text, priority, done } = req.body;

  if (text === undefined && priority === undefined && done === undefined) {
    return res.status(400).json({
      success: false,
      message: "Validation failed: at least one field (text, priority, done) is required to update."
    });
  }

  if (text !== undefined && (typeof text !== "string" || text.trim().length === 0)) {
    return res.status(400).json({
      success: false,
      message: "Validation failed: 'text' must be a non-empty string."
    });
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: `Validation failed: 'priority' must be one of ${VALID_PRIORITIES.join(", ")}.`
    });
  }

  if (done !== undefined && typeof done !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Validation failed: 'done' must be a boolean."
    });
  }

  next();
}

function validateIdParam(req, res, next) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Validation failed: 'id' must be a valid number."
    });
  }
  req.taskId = id;
  next();
}

module.exports = { validateTaskCreate, validateTaskUpdate, validateIdParam };