const express = require('express');
const { generateTasks, prioritizeTasks } = require('./ai.controller');
const { requireAuth } = require('./auth');

const router = express.Router();
router.use(requireAuth);

router.post('/generate-tasks', generateTasks);
router.post('/prioritize', prioritizeTasks);

module.exports = router;
