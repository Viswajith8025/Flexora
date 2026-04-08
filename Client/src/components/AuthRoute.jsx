import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const AuthRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Pass the current location as state so the auth page knows
        // where to redirect after successful login
        navigate('/flexoraauth', { state: { from: location.pathname }, replace: true });
        return;
      }

      try {
        const { data } = await api.getCurrentUser();
        
        // Convert backend role to frontend role naming
        const frontendRole = data.role === 'provider' ? 'job_provider' : 
                           data.role === 'user' ? 'job_seeker' : 
                           data.role;
        
        if (requiredRole && frontendRole !== requiredRole) {
          navigate('/');
          return;
        }
        
        // Store user data with consistent role naming
        localStorage.setItem('user', JSON.stringify({
          ...data,
          role: frontendRole
        }));
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/flexoraauth', { state: { from: location.pathname }, replace: true });
      }
    };

    checkAuth();
  }, [navigate, requiredRole, location.pathname]);

  return children;
};

export default AuthRoute;