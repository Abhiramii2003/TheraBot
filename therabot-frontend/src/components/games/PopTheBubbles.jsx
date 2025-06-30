import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateGameStreak } from '../../api/api'; // ✅ import

export default function PopTheBubbles() {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const newBubble = {
        id: Date.now(),
        top: Math.random() * 80,
        left: Math.random() * 90
      };
      setBubbles(prev => [...prev, newBubble]);
    }, 800);

    // ✅ update streak on game load
    const token = localStorage.getItem('token');
    if (token) {
      updateGameStreak(token).then((res) => {
        console.log('🟢 Game streak updated:', res?.streak);
      });
    }

    return () => clearInterval(interval);
  }, []);

  const popBubble = id => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setScore(score + 1);
  };

  return (
    <div style={styles.container}>
      <h2 style={{ color: '#fff' }}>Score: {score}</h2>
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          onClick={() => popBubble(bubble.id)}
          style={{
            ...styles.bubble,
            top: `${bubble.top}%`,
            left: `${bubble.left}%`
          }}
        />
      ))}
      <button style={styles.backBtn} onClick={() => navigate('/games')}>
        ← Back to Games
      </button>
    </div>
  );
}

const styles = {
  container: {
    background: '#001f3f',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: '#00bfff',
    cursor: 'pointer',
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
