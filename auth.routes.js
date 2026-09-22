const express = require('express');
const { register, login, logout, me } = require('./auth.controller');
const { requireAuth } = require('./auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);

module.exports = router;
