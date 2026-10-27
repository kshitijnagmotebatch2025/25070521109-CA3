function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Malformed JSON in request body' });
  }
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: errors[0], errors });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: `Invalid value for ${err.path}` });
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Something went wrong on the server' });
}

module.exports = { notFound, errorHandler };
