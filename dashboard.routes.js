const express = require('express');
const { getDashboard } = require('./dashboard.controller');
const { requireAuth } = require('./auth');

const router = express.Router();
router.get('/', requireAuth, getDashboard);

module.exports = router;
