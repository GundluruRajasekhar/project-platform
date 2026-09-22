const express = require('express');
const {
  listProjects, getProject, createProject, updateProject, deleteProject,
} = require('./project.controller');
const { requireAuth } = require('./auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', listProjects);
router.get('/:id', getProject);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
