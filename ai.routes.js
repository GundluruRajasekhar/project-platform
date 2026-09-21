const express = require('express');
const { generateTasks, prioritizeTasks } = require('../controllers/ai.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.post('/generate-tasks', generateTasks);
router.post('/prioritize', prioritizeTasks);

module.exports = router;
