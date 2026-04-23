import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Send, MicOff } from 'lucide-react';
import { aiService } from '../services/aiService';
import './ChatbotPage.css';

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello. I am here. Tell me what is on your mind.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Voice Assistant State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch all user data (quotes, habits, budget) to inject into the AI's context
    const initializeAI = async () => {
      const { storageService } = await import('../services/storageService');
      const userData = await storageService.getAllUserData();
      const savedHistory = await storageService.getChatHistory();
      
      await aiService.initChat(userData, savedHistory);
      
      if (savedHistory && savedHistory.length > 0) {
        setMessages(savedHistory);
      }
    };
    
    initializeAI();
    
    // Initialize Speech Recognition if supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        // We don't auto-send so the user can review/edit the transcription
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await aiService.sendMessage(userText);
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
      speakText(responseText); // Optional: Read out the response
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Optional: Set a specific voice or pitch here
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="chat-container">
      <nav className="chat-nav glass-panel">
        <button className="icon-btn" onClick={() => navigate('/home')}>
          <ArrowLeft size={24} />
        </button>
        <div className="chat-header-info">
          <h2>Soul Replica</h2>
          <span className="status">Online</span>
        </div>
        <button className="btn-secondary btn-sm" onClick={async () => {
          const { storageService } = await import('../services/storageService');
          await storageService.clearChatHistory();
          setMessages([{ role: 'assistant', text: 'History cleared. Let us start fresh.' }]);
          aiService.initChat(null, []); // reset memory
        }} style={{ marginLeft: 'auto', fontSize: '0.8rem', padding: '6px 12px' }}>
          🗑️ Clear
        </button>
      </nav>

      <main className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.role}`}>
            <div className={`message-bubble ${msg.role === 'user' ? 'bg-gradient' : 'glass-panel'}`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-wrapper assistant">
            <div className="message-bubble glass-panel typing-indicator">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <div className="chat-input-area glass-panel">
        <button 
          className={`voice-btn ${isListening ? 'listening' : ''}`} 
          onClick={toggleListening}
          title="Toggle Voice Input"
        >
          {isListening ? <MicOff size={24} color="var(--danger)" /> : <Mic size={24} />}
        </button>
        <input 
          type="text" 
          placeholder="Speak to your soul..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="send-btn" onClick={handleSend} disabled={isTyping || !input.trim()}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;
