import React from 'react';
import { useNavigate } from 'react-router-dom';



export default function GamesHub() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧘 Stress Relief Games</h1>
      <div style={styles.buttonContainer}>
        <button style={styles.gameBtn} onClick={() => navigate('/games/breathing')}>
          🌬️ Breathing Game
        </button>
        <button style={styles.gameBtn} onClick={() => navigate('/games/smile')}>
          😄 Catch the Smile
        </button>
        <button style={styles.gameBtn} onClick={() => navigate('/games/bubbles')}>
          🫧 Pop the Bubbles
        </button>
        <button style={styles.gameBtn} onClick={() => navigate('/games/memory')}>
        🧠 Memory Match
        </button>

      </div>
      <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '30px',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    maxWidth: '300px',
  },
  gameBtn: {
    padding: '15px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: '0.3s',
  },
  backBtn: {
    marginTop: '40px',
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: '#eee',
    color: '#000',
    border: 'none',
    cursor: 'pointer',
  },
};
