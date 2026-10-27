const express = require('express');
const c = require('../controllers/authController');

const router = express.Router();
router.post('/register', c.register);
router.post('/login', c.login);

module.exports = router;
