import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  function load() {
    client.get('/projects').then((res) => setProjects(res.data.data));
  }

  useEffect(load, []);

  async function createProject(e) {
    e.preventDefault();
    await client.post('/projects', { name, description });
    setName('');
    setDescription('');
    load();
  }

  async function deleteProject(id) {
    await client.delete(`/projects/${id}`);
    load();
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Projects</h1>

      <form onSubmit={createProject} className="bg-slate-900 rounded-xl p-4 flex gap-3 flex-wrap">
        <input
          placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)}
          className="flex-1 min-w-[160px] px-3 py-2 rounded bg-slate-800 border border-slate-700"
        />
        <input
          placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 rounded bg-slate-800 border border-slate-700"
        />
        <button className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded font-medium">
          Create
        </button>
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="bg-slate-900 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <Link to={`/projects/${p.id}`} className="font-semibold hover:text-indigo-400">
                  {p.name}
                </Link>
                <p className="text-slate-400 text-sm mt-1">{p.description}</p>
              </div>
              <button
                onClick={() => deleteProject(p.id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
            <div className="flex justify-between mt-3 text-xs text-slate-500">
              <span>{p.status}</span>
              <span>{p._count?.tasks ?? 0} tasks</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
