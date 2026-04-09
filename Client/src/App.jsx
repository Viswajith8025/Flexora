import LandingPage from './components/Landingpage';
import Userhome from './components/Userhome';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

function App() {
  const { user } = useAuth();
  if (!user) return <LandingPage />;
  if (user.role === 'admin') return <Navigate to="/flexora-admin" replace />;
  return <Userhome />;
}

export default App;
