const express = require('express');
const { listTasks, createTask, updateTask, deleteTask } = require('./task.controller');
const { requireAuth } = require('./auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', listTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
