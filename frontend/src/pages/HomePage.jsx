import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, LineChart, MessageSquare, Bell, LogOut, Plus, X } from 'lucide-react';
import { storageService } from '../services/storageService';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [dailyQuote, setDailyQuote] = useState('');
  const [isAddingQuote, setIsAddingQuote] = useState(false);
  const [newQuote, setNewQuote] = useState('');

  useEffect(() => {
    const loadQuote = async () => {
      const quote = await storageService.getDailyQuote();
      setDailyQuote(quote);
    };
    loadQuote();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('soul_replica_auth');
    navigate('/');
  };

  const handleAddQuote = async () => {
    if (!newQuote.trim()) return;
    await storageService.addQuote(newQuote.trim());
    setNewQuote('');
    setIsAddingQuote(false);
    
    // Refresh the quote in case this was the first one added today
    const updatedQuote = await storageService.getDailyQuote();
    setDailyQuote(updatedQuote);
  };

  return (
    <div className="home-container">
      <nav className="top-nav glass-panel">
        <div className="logo">
          <BrainCircuit className="text-gradient" size={24} />
          <span>Soul Replica</span>
        </div>
        <div className="nav-actions">
          <button className="icon-btn"><Bell size={20} /></button>
          <button className="icon-btn" onClick={handleLogout}><LogOut size={20} /></button>
        </div>
      </nav>

      <main className="home-content">
        <div className="welcome-section animate-fade-in">
          <h2>Good morning, User.</h2>
          <p className="text-secondary">Your soul is ready to listen.</p>
        </div>

        {/* Daily Quote Section */}
        <div className="quote-card glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="quote-header">
            <span className="quote-label">Daily Strength</span>
            <button className="icon-btn-small" onClick={() => setIsAddingQuote(!isAddingQuote)}>
              {isAddingQuote ? <X size={16} /> : <Plus size={16} />}
            </button>
          </div>
          
          <p className="quote-text">"{dailyQuote}"</p>

          {isAddingQuote && (
            <div className="add-quote-section animate-fade-in">
              <input 
                type="text" 
                placeholder="Write your thought or quote here..." 
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddQuote()}
              />
              <button className="btn-primary btn-sm" onClick={handleAddQuote}>Save</button>
            </div>
          )}
        </div>

        <div className="action-grid animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="action-card glass-panel" onClick={() => navigate('/chat')}>
            <div className="action-icon-wrapper bg-gradient">
              <MessageSquare size={28} color="white" />
            </div>
            <h3>Talk to Replica</h3>
            <p>Chat or use voice to share your thoughts.</p>
          </div>

          <div className="action-card glass-panel" onClick={() => navigate('/tracker')}>
            <div className="action-icon-wrapper" style={{ background: 'var(--success)' }}>
              <LineChart size={28} color="white" />
            </div>
            <h3>Track Life</h3>
            <p>Manage habits and budget.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
