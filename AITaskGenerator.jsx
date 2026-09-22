import { useState } from 'react';
import client from './client';

export default function AITaskGenerator({ projectId, onSaved }) {
  const [goal, setGoal] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generate(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await client.post('/ai/generate-tasks', { projectId, prompt: goal });
      setSuggestions(data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'AI generation failed');
    } finally {
      setLoading(false);
    }
  }

  async function acceptAll() {
    await client.post(`/ai/generate-tasks?save=true`, { projectId, prompt: goal });
    setSuggestions(null);
    setGoal('');
    onSaved?.();
  }

  return (
    <div className="bg-slate-900 border border-indigo-900/50 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-indigo-400 font-semibold">✦ AI Task Generator</span>
      </div>
      <form onSubmit={generate} className="flex gap-3">
        <input
          placeholder="Describe a goal, e.g. 'launch the v1 landing page'"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-slate-800 border border-slate-700"
        />
        <button
          disabled={loading || !goal}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-2 rounded font-medium"
        >
          {loading ? 'Thinking...' : 'Generate'}
        </button>
      </form>
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {suggestions && (
        <div className="space-y-2">
          {suggestions.map((t, i) => (
            <div key={i} className="bg-slate-800 rounded-lg p-3 text-sm">
              <p className="font-medium">{t.title} <span className="text-xs text-slate-400">({t.priority})</span></p>
              <p className="text-slate-400">{t.description}</p>
            </div>
          ))}
          <button
            onClick={acceptAll}
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded font-medium text-sm"
          >
            Accept & add all to project
          </button>
        </div>
      )}
    </div>
  );
}
