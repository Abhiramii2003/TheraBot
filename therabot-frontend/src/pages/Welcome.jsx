import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-text">
          <h1 className="welcome-title">
            Welcome to <span className="therabot-highlight">TheraBot</span>
          </h1>
          <p className="welcome-subtitle">
            Your compassionate AI companion for emotional wellness and mental health support
          </p>
          <div className="welcome-features">
            <div className="feature">
              <div className="feature-icon">💬</div>
              <p>Thoughtful conversations</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🧠</div>
              <p>Mental health tracking</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🎮</div>
              <p>Therapeutic activities</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/login')} 
          className="start-button"
        >
          Begin Your Journey
          <span className="button-arrow">→</span>
        </button>
      </div>
      
      <div className="welcome-graphic">
        <div className="bot-illustration">
          <div className="bot-face">
            <div className="bot-eyes">
              <div className="eye"></div>
              <div className="eye"></div>
            </div>
            <div className="bot-smile"></div>
          </div>
        </div>
        <div className="floating-shapes">
          <div className="shape circle"></div>
          <div className="shape triangle"></div>
          <div className="shape square"></div>
        </div>
      </div>
    </div>
  );
}