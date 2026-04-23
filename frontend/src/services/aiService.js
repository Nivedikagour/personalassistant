// The frontend no longer talks directly to Gemini. 
// It sends requests to our secure Node.js backend.

let chatHistory = [];
let systemContext = "";

export const aiService = {
  
  async initChat(userData = null, savedHistory = []) {
    // Construct dynamic system context based on user data
    systemContext = `
You are a "Soul Replica", an intelligent, highly empathetic confidant and personal journal. 
Your goal is to provide thoughtful, non-judgmental, and personalized advice based on the user's past experiences, habits, and thoughts.
Speak warmly, directly, and naturally. You are not just an AI; you are a reflection of the user's soul.
When giving advice, be philosophical but practical.
`;

    if (userData) {
      systemContext += `\n\nHere is the current state of the user's life that you MUST remember and reference if asked:`;
      
      if (userData.quotes && userData.quotes.length > 0) {
        systemContext += `\n- Personal Thoughts/Quotes: [${userData.quotes.join(" | ")}]`;
      }
      
      if (userData.habits && userData.habits.length > 0) {
        const goodHabits = userData.habits.filter(h => h.type === 'good').map(h => h.name).join(', ') || 'None yet';
        const badHabits = userData.habits.filter(h => h.type === 'bad').map(h => h.name).join(', ') || 'None yet';
        systemContext += `\n- Good Habits they are tracking: ${goodHabits}`;
        systemContext += `\n- Bad Habits they are trying to break: ${badHabits}`;
      } else {
        systemContext += `\n- Habits: No habits tracked yet.`;
      }
      
      if (userData.budget) {
        systemContext += `\n- Current Financial Balance: ₹${userData.budget.balance.toFixed(2)}`;
        if (userData.budget.entries && userData.budget.entries.length > 0) {
           const recentTransactions = userData.budget.entries.slice(-5).map(e => `${e.title}: ₹${e.amount}`).join(', ');
           systemContext += `\n- Recent Transactions: ${recentTransactions}`;
        }
      } else {
         systemContext += `\n- Financials: No budget tracked yet.`;
      }
    }

    chatHistory = savedHistory;
  },

  async sendMessage(messageText) {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://personalassistant-1.onrender.com';
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText,
          history: chatHistory,
          context: systemContext
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch from backend");
      }

      // Add to local history so we can pass it along next time
      chatHistory.push({ role: 'user', text: messageText });
      chatHistory.push({ role: 'assistant', text: data.response });
      
      // Persist to IndexedDB
      const { storageService } = await import('./storageService');
      await storageService.saveChatHistory(chatHistory);
      
      return data.response;
      
    } catch (error) {
      console.error("Error communicating with Backend API:", error);
      return "I'm having trouble connecting to my core right now. Is the backend server running?";
    }
  }
};
