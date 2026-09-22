import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from './client';
import AITaskGenerator from './AITaskGenerator';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  function load() {
    client.get(`/projects/${id}`).then((res) => setProject(res.data.data));
  }

  useEffect(load, [id]);

  async function createTask(e) {
    e.preventDefault();
    await client.post('/tasks', { title, projectId: id });
    setTitle('');
    load();
  }

  async function updateStatus(taskId, status) {
    await client.put(`/tasks/${taskId}`, { status });
    load();
  }

  if (!project) return <p className="p-6 text-slate-400">Loading...</p>;

  const filteredTasks = project.tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="text-slate-400">{project.description}</p>
      </div>

      <AITaskGenerator projectId={id} onSaved={load} />

      <form onSubmit={createTask} className="flex gap-3">
        <input
          placeholder="New task title" value={title} onChange={(e) => setTitle(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-slate-800 border border-slate-700"
        />
        <button className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded font-medium">Add</button>
      </form>

      <div className="flex gap-3">
        <input
          placeholder="Search tasks" value={search} onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-sm"
        />
        <select
          value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-sm"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        {filteredTasks.map((t) => (
          <div key={t.id} className="bg-slate-900 rounded-lg p-3 flex justify-between items-center text-sm">
            <div>
              <p className="font-medium">
                {t.title} {t.aiGenerated && <span className="text-indigo-400 text-xs ml-1">AI</span>}
              </p>
              <p className="text-slate-500 text-xs">{t.priority}</p>
            </div>
            <select
              value={t.status}
              onChange={(e) => updateStatus(t.id, e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
