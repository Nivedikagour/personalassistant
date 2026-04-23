import localforage from 'localforage';

// Configure localforage stores
const quotesStore = localforage.createInstance({ name: 'soul_replica', storeName: 'quotes' });
const habitsStore = localforage.createInstance({ name: 'soul_replica', storeName: 'habits' });
const budgetStore = localforage.createInstance({ name: 'soul_replica', storeName: 'budget' });
const chatStore = localforage.createInstance({ name: 'soul_replica', storeName: 'chat' });

const defaultQuotes = [
  "Safar lamba hoga tum sunder nahi samajhdar chunna"
];

export const storageService = {
  // --- Quotes ---
  async initQuotes() {
    const quotes = await quotesStore.getItem('all_quotes');
    if (!quotes) {
      await quotesStore.setItem('all_quotes', defaultQuotes);
    }
  },

  async getQuotes() {
    await this.initQuotes();
    return (await quotesStore.getItem('all_quotes')) || [];
  },

  async addQuote(quote) {
    const quotes = await this.getQuotes();
    quotes.push(quote);
    await quotesStore.setItem('all_quotes', quotes);
    return quotes;
  },

  async getDailyQuote() {
    const quotes = await this.getQuotes();
    if (quotes.length === 0) return "No quotes available.";
    const today = new Date();
    const dayIndex = (today.getFullYear() + today.getMonth() + today.getDate()) % quotes.length;
    return quotes[dayIndex];
  },

  // --- Habits ---
  async getHabits() {
    return (await habitsStore.getItem('all_habits')) || [];
  },

  async addHabit(habit) {
    // habit shape: { id, name, type: 'good' | 'bad', logs: [] }
    const habits = await this.getHabits();
    habits.push(habit);
    await habitsStore.setItem('all_habits', habits);
    return habits;
  },

  // --- Budget ---
  async getBudgetEntries() {
    return (await budgetStore.getItem('all_entries')) || [];
  },

  async addBudgetEntry(entry) {
    // entry shape: { id, title, amount: number (positive for income, negative for expense), date }
    const entries = await this.getBudgetEntries();
    entries.push(entry);
    await budgetStore.setItem('all_entries', entries);
    return entries;
  },
  
  async getBudgetSummary() {
    const entries = await this.getBudgetEntries();
    const balance = entries.reduce((acc, curr) => acc + curr.amount, 0);
    return { balance, entries };
  },

  // --- Chat History ---
  async getChatHistory() {
    return (await chatStore.getItem('history')) || [];
  },

  async saveChatHistory(history) {
    await chatStore.setItem('history', history);
  },

  async clearChatHistory() {
    await chatStore.removeItem('history');
  },

  // --- All User Data (for AI Context) ---
  async getAllUserData() {
    const quotes = await this.getQuotes();
    const habits = await this.getHabits();
    const budget = await this.getBudgetSummary();
    
    return {
      quotes,
      habits,
      budget
    };
  }
};

