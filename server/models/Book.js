const mongoose = require('mongoose');

const GENRES = ['Fiction', 'Non-fiction', 'Science', 'History', 'Biography', 'Fantasy', 'Technology', 'Other'];
const STATUSES = ['To Read', 'Reading', 'Finished'];

const bookSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: [150, 'Title must be 150 characters or fewer'] },
    author: { type: String, required: [true, 'Author is required'], trim: true, maxlength: [100, 'Author must be 100 characters or fewer'] },
    genre: { type: String, enum: { values: GENRES, message: 'Genre must be one of: ' + GENRES.join(', ') }, default: 'Other' },
    status: { type: String, enum: { values: STATUSES, message: 'Status must be one of: ' + STATUSES.join(', ') }, default: 'To Read' },
    rating: { type: Number, min: [0, 'Rating cannot be below 0'], max: [5, 'Rating cannot be above 5'], default: 0, validate: { validator: Number.isInteger, message: 'Rating must be a whole number' } },
    pages: { type: Number, min: [1, 'Pages must be at least 1'], validate: { validator: (v) => v == null || Number.isInteger(v), message: 'Pages must be a whole number' } },
    notes: { type: String, trim: true, maxlength: [1000, 'Notes must be 1000 characters or fewer'], default: '' },
  },
  { timestamps: true }
);

const Book = mongoose.model('Book', bookSchema);
Book.GENRES = GENRES;
Book.STATUSES = STATUSES;
module.exports = Book;
