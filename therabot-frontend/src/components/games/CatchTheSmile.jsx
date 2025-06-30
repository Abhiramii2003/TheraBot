// src/components/games/CatchTheSmile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateGameStreak } from '../../api/api'; // ✅ import streak API

export default function CatchTheSmile() {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ top: 100, left: 100 });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      updateGameStreak(token).then((res) => {
        console.log('🟢 Streak updated:', res?.streak);
      });
    }
  }, []);

  const moveSmiley = () => {
    const top = Math.random() * (window.innerHeight - 100);
    const left = Math.random() * (window.innerWidth - 100);
    setPosition({ top, left });
  };

  return (
    <div style={styles.container}>
      <h2 style={{ color: '#fff' }}>Score: {score}</h2>
      <div
        onClick={() => {
          setScore(score + 1);
          moveSmiley();
        }}
        style={{
          ...styles.smiley,
          top: position.top,
          left: position.left
        }}
      >
        😄
      </div>
      <button style={styles.backBtn} onClick={() => navigate('/games')}>
        ← Back to Games
      </button>
    </div>
  );
}

const styles = {
  container: {
    background: '#2b2b52',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  smiley: {
    position: 'absolute',
    fontSize: '40px',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out'
  },
  backBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: '10px 20px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    cursor: 'pointer'
  }
};
