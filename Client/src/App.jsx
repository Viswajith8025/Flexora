import LandingPage from './components/Landingpage';
import Userhome from './components/Userhome';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

function App() {
  return <LandingPage />;
}

export default App;
