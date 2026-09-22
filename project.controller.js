const prisma = require('./db');

async function listProjects(req, res, next) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: req.user.id },
          { members: { some: { userId: req.user.id } } },
        ],
      },
      include: { _count: { select: { tasks: true } } },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
}

async function getProject(req, res, next) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { tasks: true, members: { include: { user: { select: { id: true, name: true, email: true } } } } },
    });
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

async function createProject(req, res, next) {
  try {
    const { name, description, status } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'name is required' });

    const project = await prisma.project.create({
      data: {
        name,
        description,
        status: status || 'ACTIVE',
        ownerId: req.user.id,
        members: { create: { userId: req.user.id, role: 'OWNER' } },
      },
    });
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

async function updateProject(req, res, next) {
  try {
    const { name, description, status } = req.body;
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { name, description, status },
    });
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

async function deleteProject(req, res, next) {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listProjects, getProject, createProject, updateProject, deleteProject };
