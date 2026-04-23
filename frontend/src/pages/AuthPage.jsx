import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import './AuthPage.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = (e) => {
    e.preventDefault();
    // Simple mock auth
    localStorage.setItem('soul_replica_auth', 'true');
    navigate('/home');
  };

  return (
    <div className="auth-container">
      <div className="glow-orb orb-1 animate-float"></div>
      <div className="auth-card glass-panel animate-fade-in">
        <div className="auth-header">
          <BrainCircuit className="text-gradient" size={40} />
          <h2>{isLogin ? 'Welcome Back' : 'Create Replica'}</h2>
          <p className="text-secondary">
            {isLogin ? 'Connect with your soul' : 'Begin your journey'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="auth-form">
          <div className="form-group">
            <label>Email or Phone</label>
            <input type="text" placeholder="Enter your email or phone" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>
          
          <button type="submit" className="btn-primary w-full">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="text-secondary">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              className="text-gradient cursor-pointer" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
