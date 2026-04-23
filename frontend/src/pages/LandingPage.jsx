import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BrainCircuit, Mic } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Background decorations */}
      <div className="glow-orb orb-1 animate-float"></div>
      <div className="glow-orb orb-2 animate-float" style={{ animationDelay: '2s' }}></div>

      <nav className="landing-nav glass-panel">
        <div className="logo">
          <BrainCircuit className="text-gradient" size={28} />
          <span>Soul Replica</span>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/auth')}>
          Log In
        </button>
      </nav>

      <main className="landing-hero">
        <div className="hero-content animate-fade-in">
          <div className="badge glass-panel">
            <Sparkles size={16} className="text-gradient" />
            <span>Your intelligent confidant</span>
          </div>
          
          <h1 className="hero-title">
            Store your mind. <br />
            <span className="text-gradient">Talk to your soul.</span>
          </h1>
          
          <p className="hero-subtitle">
            A deeply personal journal and voice assistant that remembers every story, analyzes your habits, and offers personalized wisdom based on your own life experiences.
          </p>

          <div className="hero-cta">
            <button className="btn-primary btn-large" onClick={() => navigate('/auth')}>
              Create Your Replica
            </button>
          </div>

          <div className="features-grid">
            <div className="feature-card glass-panel">
              <Mic size={24} className="feature-icon" />
              <h3>Voice Activated</h3>
              <p>Speak naturally. Your replica listens and responds with a custom persona.</p>
            </div>
            <div className="feature-card glass-panel">
              <BrainCircuit size={24} className="feature-icon" />
              <h3>Permanent Memory</h3>
              <p>It remembers your quotes, stories, and context to give better advice over time.</p>
            </div>
            <div className="feature-card glass-panel">
              <Sparkles size={24} className="feature-icon" />
              <h3>Habit & Finance</h3>
              <p>Track your life. Get alerts and encouragement based on your goals.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
