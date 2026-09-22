import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
      <div className="flex gap-6 items-center">
        <span className="font-bold text-lg">Task 4 Platform</span>
        {user && (
          <>
            <Link to="/dashboard" className="text-slate-300 hover:text-white">Dashboard</Link>
            <Link to="/projects" className="text-slate-300 hover:text-white">Projects</Link>
          </>
        )}
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">{user.name}</span>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
