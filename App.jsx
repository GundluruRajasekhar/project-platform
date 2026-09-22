import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Projects from './Projects';
import ProjectDetail from './ProjectDetail';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/projects"
          element={<ProtectedRoute><Projects /></ProtectedRoute>}
        />
        <Route
          path="/projects/:id"
          element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>}
        />
      </Routes>
    </>
  );
}
