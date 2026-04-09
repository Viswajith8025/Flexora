import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthRoute = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return; // Wait until auth context has resolved

    if (!user) {
      // Not logged in at all — go to auth
      navigate('/flexoraauth', { state: { from: location.pathname }, replace: true });
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      // Logged in but wrong role — go home
      console.warn(`Role mismatch: Expected "${requiredRole}", got "${user.role}". User: ${user.email}`);
      navigate('/', { replace: true });
    }
  }, [user, isLoading, requiredRole, navigate, location.pathname]);

  // Show spinner only while auth is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  // If no user or wrong role — return null while navigate fires
  if (!user) return null;
  if (requiredRole && user.role !== requiredRole) return null;

  return children;
};

export default AuthRoute;