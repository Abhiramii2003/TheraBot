import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

export default function ChatBot() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([
    {
      sender: 'bot',
      text: "Hello there! I'm TheraBot. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: 'user', text: input, timestamp: new Date() };
    setChat(prev => [...prev, newMessage]);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      if (res.ok) {
        setChat(prev => [...prev, {
          sender: 'bot',
          text: data.response,
          timestamp: new Date()
        }]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err) {
      setError(err.message);
      setChat(prev => [...prev, {
        sender: 'bot',
        text: "I'm having trouble connecting. Please try again later.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="bot-avatar">
          <div className="bot-eyes">
            <div className="eye"></div>
            <div className="eye"></div>
          </div>
          <div className="bot-smile"></div>
        </div>
        <h2>TheraBot</h2>
        <p className="subtitle">Your mental wellness companion</p>
      </div>

      <div className="chat-window">
        {chat.map((msg, idx) => (
          <div key={idx} className={`message-container ${msg.sender}`}>
            <div className={`message-bubble ${msg.sender}`}>
              <div className="message-text">{msg.text}</div>
              <div className="message-time">{formatTime(msg.timestamp)}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="message-container bot">
            <div className="message-bubble bot">
              <div className="typing-indicator">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="input-area">
        <div className="input-wrapper">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts..."
            rows="1"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="send-button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <p className="input-hint">TheraBot is here to listen, not judge</p>
      </div>
    </div>
  );
}
