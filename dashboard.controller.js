const prisma = require('./db');

async function getDashboard(req, res, next) {
  try {
    const userId = req.user.id;

    const [projectCount, taskCounts, recentTasks] = await Promise.all([
      prisma.project.count({
        where: { OR: [{ ownerId: userId }, { members: { some: { userId } } }] },
      }),
      prisma.task.groupBy({
        by: ['status'],
        where: { project: { OR: [{ ownerId: userId }, { members: { some: { userId } } }] } },
        _count: true,
      }),
      prisma.task.findMany({
        where: { project: { OR: [{ ownerId: userId }, { members: { some: { userId } } }] } },
        orderBy: { updatedAt: 'desc' },
        take: 10,
        include: { project: { select: { name: true } } },
      }),
    ]);

    const statsByStatus = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
    taskCounts.forEach((c) => { statsByStatus[c.status] = c._count; });

    const totalTasks = Object.values(statsByStatus).reduce((a, b) => a + b, 0);
    const progressPct = totalTasks ? Math.round((statsByStatus.DONE / totalTasks) * 100) : 0;

    res.json({
      success: true,
      data: {
        projectCount,
        taskStats: statsByStatus,
        totalTasks,
        progressPct,
        recentActivity: recentTasks,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard };
