const mongoose = require('mongoose');

module.exports = function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid book ID' });
  }
  next();
};
