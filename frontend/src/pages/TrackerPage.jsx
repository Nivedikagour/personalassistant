import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { storageService } from '../services/storageService';
import './TrackerPage.css';

const TrackerPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('habits'); // 'habits' or 'budget'
  
  const [habits, setHabits] = useState([]);
  const [budgetEntries, setBudgetEntries] = useState([]);
  const [balance, setBalance] = useState(0);

  // Modals/Inputs state
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitType, setNewHabitType] = useState('good'); // 'good' or 'bad'

  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [newBudgetTitle, setNewBudgetTitle] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const h = await storageService.getHabits();
    setHabits(h);
    
    const b = await storageService.getBudgetSummary();
    setBudgetEntries(b.entries);
    setBalance(b.balance);
  };

  const handleAddHabit = async () => {
    if (!newHabitName.trim()) return;
    const newHabit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      type: newHabitType,
      logs: []
    };
    await storageService.addHabit(newHabit);
    setNewHabitName('');
    setIsAddingHabit(false);
    loadData();
  };

  const handleAddBudget = async () => {
    if (!newBudgetTitle.trim() || !newBudgetAmount) return;
    const amount = parseFloat(newBudgetAmount);
    if (isNaN(amount)) return;
    
    const newEntry = {
      id: Date.now().toString(),
      title: newBudgetTitle.trim(),
      amount: amount,
      date: new Date().toISOString()
    };
    
    await storageService.addBudgetEntry(newEntry);
    setNewBudgetTitle('');
    setNewBudgetAmount('');
    setIsAddingBudget(false);
    loadData();
  };

  return (
    <div className="tracker-container">
      <nav className="tracker-nav glass-panel">
        <button className="icon-btn" onClick={() => navigate('/home')}>
          <ArrowLeft size={24} />
        </button>
        <h2>Life Tracker</h2>
      </nav>

      <main className="tracker-content">
        <div className="tabs glass-panel">
          <button 
            className={`tab-btn ${activeTab === 'habits' ? 'active' : ''}`}
            onClick={() => setActiveTab('habits')}
          >
            <Target size={18} /> Habits
          </button>
          <button 
            className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            <TrendingUp size={18} /> Budget
          </button>
        </div>

        {activeTab === 'habits' && (
          <div className="tab-pane animate-fade-in">
            <div className="pane-header">
              <h3>Your Habits</h3>
              <button className="btn-primary btn-sm" onClick={() => setIsAddingHabit(!isAddingHabit)}>
                {isAddingHabit ? 'Cancel' : <><Plus size={16} /> Add Habit</>}
              </button>
            </div>

            {isAddingHabit && (
              <div className="add-form glass-panel animate-fade-in">
                <input 
                  type="text" 
                  placeholder="Habit Name (e.g., Read 10 Pages)" 
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                />
                <select value={newHabitType} onChange={(e) => setNewHabitType(e.target.value)}>
                  <option value="good">Good Habit</option>
                  <option value="bad">Bad Habit (To Break)</option>
                </select>
                <button className="btn-primary btn-sm" onClick={handleAddHabit}>Save Habit</button>
              </div>
            )}

            <div className="list-container glass-panel mt-4">
              {habits.length === 0 ? (
                <p className="empty-state">No habits tracked yet.</p>
              ) : (
                habits.map(habit => (
                  <div key={habit.id} className="list-item">
                    <div className="item-info">
                      <h4>{habit.name}</h4>
                      <span className={habit.type === 'good' ? 'badge-good' : 'badge-bad'}>
                        {habit.type === 'good' ? 'Good Habit' : 'Bad Habit'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="tab-pane animate-fade-in">
            <div className="pane-header">
              <h3>Finance Overview</h3>
              <button className="btn-primary btn-sm" onClick={() => setIsAddingBudget(!isAddingBudget)}>
                {isAddingBudget ? 'Cancel' : <><Plus size={16} /> Add Entry</>}
              </button>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card glass-panel">
                <span className="text-secondary">Balance</span>
                <h2 className={balance >= 0 ? 'text-success' : 'text-danger'}>
                  ₹{balance.toFixed(2)}
                </h2>
              </div>
              <div className="stat-card glass-panel">
                <span className="text-secondary">Total Entries</span>
                <h2>{budgetEntries.length}</h2>
              </div>
            </div>

            {isAddingBudget && (
              <div className="add-form glass-panel animate-fade-in mt-4">
                <input 
                  type="text" 
                  placeholder="Entry Title (e.g., Salary, Groceries)" 
                  value={newBudgetTitle}
                  onChange={(e) => setNewBudgetTitle(e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="Amount (+ for income, - for expense)" 
                  value={newBudgetAmount}
                  onChange={(e) => setNewBudgetAmount(e.target.value)}
                />
                <button className="btn-primary btn-sm" onClick={handleAddBudget}>Save Entry</button>
              </div>
            )}

            <div className="list-container glass-panel mt-4">
              {budgetEntries.length === 0 ? (
                <p className="empty-state">No transactions yet.</p>
              ) : (
                budgetEntries.map(entry => (
                  <div key={entry.id} className="list-item">
                    <div className="item-info">
                      <h4>{entry.title}</h4>
                      <span className="text-secondary">{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                    <span className={`flex items-center gap-1 ${entry.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                      {entry.amount >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />} 
                      {entry.amount > 0 ? '+' : ''}₹{entry.amount.toFixed(2)}
                    </span>
                  </div>
                )).reverse()
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TrackerPage;
