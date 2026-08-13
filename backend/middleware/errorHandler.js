function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`
  });
}

function errorHandler(err, req, res, next) {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error. Something went wrong."
  });
}

module.exports = { notFoundHandler, errorHandler };