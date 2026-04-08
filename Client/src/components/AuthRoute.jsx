import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/flexoraauth');
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
        navigate('/flexoraauth');
      }
    };

    checkAuth();
  }, [navigate, requiredRole]);

  return children;
};

export default AuthRoute;