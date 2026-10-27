const express = require('express');
const c = require('../controllers/bookController');
const validateObjectId = require('../middleware/validateObjectId');
const validateBook = require('../middleware/validateBook');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', c.getBooks);
router.get('/stats', c.getStats); // must stay above '/:id'
router.post('/', validateBook, c.createBook);
router.get('/:id', validateObjectId, c.getBook);
router.put('/:id', validateObjectId, validateBook, c.updateBook);
router.delete('/:id', validateObjectId, c.deleteBook);

module.exports = router;
