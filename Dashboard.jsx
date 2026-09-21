import { useEffect, useState } from 'react';
import client from '../api/client';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    client.get('/dashboard').then((res) => setData(res.data.data));
  }, []);

  if (!data) return <p className="p-6 text-slate-400">Loading...</p>;

  const cards = [
    { label: 'Projects', value: data.projectCount },
    { label: 'To Do', value: data.taskStats.TODO },
    { label: 'In Progress', value: data.taskStats.IN_PROGRESS },
    { label: 'Done', value: data.taskStats.DONE },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-slate-900 rounded-xl p-4">
            <p className="text-slate-400 text-sm">{c.label}</p>
            <p className="text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl p-4">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>Overall progress</span>
          <span>{data.progressPct}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${data.progressPct}%` }} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Recent activity</h2>
        <div className="space-y-2">
          {data.recentActivity.map((t) => (
            <div key={t.id} className="bg-slate-900 rounded-lg p-3 flex justify-between text-sm">
              <span>{t.title} <span className="text-slate-500">— {t.project.name}</span></span>
              <span className="text-slate-400">{t.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
