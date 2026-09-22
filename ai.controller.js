const prisma = require('../config/db');
const { askForJSON, aiEnabled } = require('../utils/ai');

// Simple templated fallback used when ANTHROPIC_API_KEY isn't configured.
// Keeps the feature demoable without a real LLM call.
function fallbackTaskBreakdown(goal) {
  const steps = ['Plan', 'Build', 'Review', 'Ship'];
  return {
    tasks: steps.map((step) => ({
      title: `${step}: ${goal}`,
      description: `${step} phase for "${goal}" (auto-generated locally — add ANTHROPIC_API_KEY for real AI suggestions).`,
      priority: step === 'Ship' ? 'HIGH' : 'MEDIUM',
    })),
  };
}

function fallbackPrioritization(tasks) {
  return {
    ranking: tasks.map((t, i) => ({
      id: t.id,
      suggestedPriority: t.dueDate ? 'HIGH' : i === 0 ? 'HIGH' : 'MEDIUM',
      reason: 'Local fallback ranking (add ANTHROPIC_API_KEY for real AI reasoning).',
    })),
  };
}

// POST /ai/generate-tasks  { projectId, prompt }
// Takes a plain-language project goal and returns a set of suggested tasks.
// Client can review/edit, then POST each to /tasks to persist (or use ?save=true to persist directly).
async function generateTasks(req, res, next) {
  try {
    const { projectId, prompt } = req.body;
    if (!projectId || !prompt) {
      return res.status(400).json({ success: false, error: 'projectId and prompt are required' });
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });

    const aiPrompt = `You are a project management assistant. Given a project and a goal, break it down into
3 to 6 concrete, actionable tasks.

Project: "${project.name}" — ${project.description || 'no description'}
Goal: "${prompt}"

Respond with ONLY valid JSON, no prose, no markdown fences, in this exact shape:
{
  "tasks": [
    { "title": "string", "description": "string", "priority": "LOW|MEDIUM|HIGH|URGENT" }
  ]
}`;

    const result = await askForJSON(aiPrompt, () => fallbackTaskBreakdown(prompt));

    if (req.query.save === 'true') {
      const created = await prisma.$transaction(
        result.tasks.map((t) =>
          prisma.task.create({
            data: {
              title: t.title,
              description: t.description,
              priority: t.priority || 'MEDIUM',
              projectId,
              creatorId: req.user.id,
              aiGenerated: true,
            },
          })
        )
      );
      return res.status(201).json({ success: true, saved: true, data: created });
    }

    res.json({ success: true, saved: false, data: result.tasks });
  } catch (err) {
    next(err);
  }
}

// POST /ai/prioritize  { projectId }
// Looks at open tasks in a project and suggests a priority ranking with reasoning.
async function prioritizeTasks(req, res, next) {
  try {
    const { projectId } = req.body;
    if (!projectId) return res.status(400).json({ success: false, error: 'projectId is required' });

    const tasks = await prisma.task.findMany({
      where: { projectId, status: { not: 'DONE' } },
      select: { id: true, title: true, dueDate: true, priority: true },
    });

    if (tasks.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const aiPrompt = `You are a project management assistant. Given this list of open tasks (JSON),
suggest an execution order and, for each, a priority (LOW|MEDIUM|HIGH|URGENT) with a one-sentence reason.

Tasks: ${JSON.stringify(tasks)}

Respond with ONLY valid JSON, no prose, no markdown fences, in this exact shape:
{ "ranking": [ { "id": "string", "suggestedPriority": "LOW|MEDIUM|HIGH|URGENT", "reason": "string" } ] }`;

    const result = await askForJSON(aiPrompt, () => fallbackPrioritization(tasks));
    res.json({ success: true, data: result.ranking });
  } catch (err) {
    next(err);
  }
}

module.exports = { generateTasks, prioritizeTasks };
