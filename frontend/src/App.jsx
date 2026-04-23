import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ChatbotPage from './pages/ChatbotPage';
import TrackerPage from './pages/TrackerPage';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('soul_replica_auth') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/home" 
            element={<ProtectedRoute><HomePage /></ProtectedRoute>} 
          />
          <Route 
            path="/chat" 
            element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} 
          />
          <Route 
            path="/tracker" 
            element={<ProtectedRoute><TrackerPage /></ProtectedRoute>} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
