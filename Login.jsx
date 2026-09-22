import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-24 p-6 bg-slate-900 rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Log in</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded font-medium">
          Log in
        </button>
      </form>
      <p className="text-slate-400 text-sm mt-4">
        No account? <Link to="/register" className="text-indigo-400">Register</Link>
      </p>
    </div>
  );
}
