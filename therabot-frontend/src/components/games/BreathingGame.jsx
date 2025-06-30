import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateGameStreak } from '../../api/api'; // ⬅️ import streak API

export default function BreathingGame() {
  const [scale, setScale] = useState(1);
  const [text, setText] = useState('Breathe In...');
  const navigate = useNavigate();

  useEffect(() => {
    let breatheIn = true;
    const interval = setInterval(() => {
      setScale(breatheIn ? 1.5 : 1);
      setText(breatheIn ? 'Breathe In...' : 'Breathe Out...');
      breatheIn = !breatheIn;
    }, 4000);

    // 🎯 Update game streak
    const token = localStorage.getItem('token');
    if (token) {
      updateGameStreak(token).then((data) => {
        if (data?.streak) {
          console.log('🟢 Game streak updated:', data.streak);
        }
      });
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={{ color: '#fff' }}>{text}</h2>
      <div
        style={{
          ...styles.circle,
          transform: `scale(${scale})`,
          transition: 'transform 4s ease-in-out',
        }}
      />
      <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

const styles = {
  container: {
    background: '#0b3d91',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 150,
    height: 150,
    backgroundColor: '#4CAF50',
    borderRadius: '50%',
    margin: '30px',
  },
  backBtn: {
    padding: '10px 20px',
    borderRadius: '10px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    marginTop: '20px',
    cursor: 'pointer',
  },
};
