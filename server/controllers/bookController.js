const Book = require('../models/Book');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const SORTS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  title: { title: 1 },
  author: { author: 1 },
  rating: { rating: -1, title: 1 },
};

// GET /api/books?q=&status=&genre=&sort=
exports.getBooks = async (req, res, next) => {
  try {
    const { q, status, genre, sort } = req.query;
    const filter = { user: req.user._id };
    if (status && Book.STATUSES.includes(status)) filter.status = status;
    if (genre && Book.GENRES.includes(genre)) filter.genre = genre;
    if (q && String(q).trim()) {
      const rx = new RegExp(escapeRegex(String(q).trim()), 'i');
      filter.$or = [{ title: rx }, { author: rx }];
    }
    const books = await Book.find(filter).sort(SORTS[sort] || SORTS.newest);
    res.json({ success: true, count: books.length, data: books });
  } catch (err) { next(err); }
};

// GET /api/books/stats
exports.getStats = async (req, res, next) => {
  try {
    const match = { $match: { user: req.user._id } };
    const [byStatus, byGenre, totals, rated] = await Promise.all([
      Book.aggregate([match, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      Book.aggregate([match, { $group: { _id: '$genre', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Book.aggregate([match, { $group: { _id: null, total: { $sum: 1 }, pages: { $sum: { $ifNull: ['$pages', 0] } } } }]),
      Book.aggregate([match, { $match: { rating: { $gt: 0 } } }, { $group: { _id: null, avg: { $avg: '$rating' } } }]),
    ]);
    res.json({
      success: true,
      data: {
        total: totals[0] ? totals[0].total : 0,
        totalPages: totals[0] ? totals[0].pages : 0,
        averageRating: rated[0] ? Math.round(rated[0].avg * 10) / 10 : 0,
        byStatus: byStatus.map((s) => ({ status: s._id, count: s.count })),
        byGenre: byGenre.map((g) => ({ genre: g._id, count: g.count })),
      },
    });
  } catch (err) { next(err); }
};

// GET /api/books/:id
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    res.json({ success: true, data: book });
  } catch (err) { next(err); }
};

// POST /api/books
exports.createBook = async (req, res, next) => {
  try {
    const book = await Book.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, message: 'Book added', data: book });
  } catch (err) { next(err); }
};

// PUT /api/books/:id  (full replace of editable fields)
exports.updateBook = async (req, res, next) => {
  try {
    const { pages, ...fields } = req.body;
    const op = { $set: fields };
    if (pages === undefined) op.$unset = { pages: 1 };
    else op.$set.pages = pages;
    const book = await Book.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, op, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    res.json({ success: true, message: 'Book updated', data: book });
  } catch (err) { next(err); }
};

// DELETE /api/books/:id
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    res.json({ success: true, message: 'Book deleted', data: { _id: book._id } });
  } catch (err) { next(err); }
};
