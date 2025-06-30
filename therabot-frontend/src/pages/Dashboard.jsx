import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGameStreak } from '../api/api';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoading(true);
      fetchGameStreak(token)
        .then(setStreak)
        .catch((err) => {
          console.error('Error fetching streak:', err);
          setStreak(0);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const featureCards = [
    { 
      title: 'ChatBot', 
      icon: '💬', 
      action: () => navigate('/chat'),
      color: '#4CAF50'
    },
    { 
      title: 'Mood Quiz', 
      icon: '🧠', 
      action: () => navigate('/mood-quiz'),
      color: '#2196F3'
    },
    { 
      title: 'Games', 
      icon: '🎮', 
      action: () => navigate('/games'),
      color: '#FF9800'
    },
    { 
      title: 'My Diary', 
      icon: '📔', 
      action: () => navigate('/diary'),
      color: '#9C27B0'
    },
    { 
      title: 'Daily News', 
      icon: '📰', 
      action: () => navigate('/news'),
      color: '#F44336'
    }
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to TheraBot</h1>
        <p className="dashboard-subtitle">Your mental wellness companion</p>
      </header>
      
      <div className="streak-container">
        <div className="streak-display">
          <div className="flame-icon">🔥</div>
          <div className="streak-info">
            <span className="streak-label">Current Streak</span>
            {isLoading ? (
              <div className="streak-loading"></div>
            ) : (
              <span className="streak-count">{streak} day{streak !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
        <p className="streak-encouragement">
          Keep going! Every day counts towards your mental wellness.
        </p>
      </div>
      
      <div className="features-grid">
        {featureCards.map((card, index) => (
          <div 
            key={index}
            className="feature-card"
            onClick={card.action}
            style={{ '--card-color': card.color }}
          >
            <div className="card-icon">{card.icon}</div>
            <h3 className="card-title">{card.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}