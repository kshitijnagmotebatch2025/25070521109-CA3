const Book = require('../models/Book');

// Server-side validation of the request body (runs before Mongoose validation).
module.exports = function validateBook(req, res, next) {
  const b = req.body;
  if (!b || typeof b !== 'object' || Array.isArray(b)) {
    return res.status(400).json({ success: false, message: 'Request body must be a JSON object' });
  }
  const errors = [];
  const str = (v) => (typeof v === 'string' ? v.trim() : '');
  const empty = (v) => v === undefined || v === null || v === '';

  if (!str(b.title)) errors.push('Title is required');
  else if (str(b.title).length > 150) errors.push('Title must be 150 characters or fewer');
  if (!str(b.author)) errors.push('Author is required');
  else if (str(b.author).length > 100) errors.push('Author must be 100 characters or fewer');
  if (b.genre !== undefined && !Book.GENRES.includes(b.genre)) errors.push('Genre must be one of: ' + Book.GENRES.join(', '));
  if (b.status !== undefined && !Book.STATUSES.includes(b.status)) errors.push('Status must be one of: ' + Book.STATUSES.join(', '));
  if (!empty(b.rating)) {
    const r = Number(b.rating);
    if (!Number.isInteger(r) || r < 0 || r > 5) errors.push('Rating must be a whole number from 0 to 5');
  }
  if (!empty(b.pages)) {
    const p = Number(b.pages);
    if (!Number.isInteger(p) || p < 1) errors.push('Pages must be a whole number of at least 1');
  }
  if (typeof b.notes === 'string' && b.notes.length > 1000) errors.push('Notes must be 1000 characters or fewer');

  if (errors.length) return res.status(400).json({ success: false, message: errors[0], errors });

  // Whitelist fields and normalise empty values.
  req.body = {
    title: str(b.title),
    author: str(b.author),
    genre: b.genre,
    status: b.status,
    rating: empty(b.rating) ? 0 : Number(b.rating),
    pages: empty(b.pages) ? undefined : Number(b.pages),
    notes: typeof b.notes === 'string' ? b.notes.trim() : '',
  };
  next();
};
