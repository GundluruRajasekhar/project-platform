const express = require('express');
const { getDashboard } = require('../controllers/dashboard.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.get('/', requireAuth, getDashboard);

module.exports = router;
