import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateGameStreak, fetchGameStreak } from '../../api/api'; // adjust path if needed

const icons = ['🍎', '🌞', '🎵', '💧', '🌙', '🌻', '🔥', '🍀'];

export default function MemoryMatchGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [turns, setTurns] = useState(0);
  const [streak, setStreak] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const shuffled = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, flipped: false }));
    setCards(shuffled);

    // Fetch streak on mount
    const token = localStorage.getItem('token');
    if (token) {
      fetchGameStreak(token).then(res => {
        if (res && res.streak !== undefined) {
          setStreak(res.streak);
        }
      });
    }
  }, []);

  useEffect(() => {
    // Check win condition
    if (matched.length === icons.length) {
      const token = localStorage.getItem('token');
      if (token) {
        updateGameStreak(token);
      }
      alert('🎉 All matched! Your streak has been updated!');
    }
  }, [matched]);

  const handleFlip = (card) => {
    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.icon)) return;
    setFlipped([...flipped, card.id]);

    if (flipped.length === 1) {
      const first = cards.find(c => c.id === flipped[0]);
      if (first.icon === card.icon) {
        setMatched([...matched, card.icon]);
      }
      setTimeout(() => setFlipped([]), 1000);
      setTurns(turns + 1);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🧠 MindMatch</h2>
      <p>Turns: {turns}</p>
      <p>🔥 Current Game Streak: {streak}</p>

      <div style={styles.grid}>
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => handleFlip(card)}
            style={{
              ...styles.card,
              backgroundColor: flipped.includes(card.id) || matched.includes(card.icon) ? '#fff' : '#333',
              color: flipped.includes(card.id) || matched.includes(card.icon) ? '#000' : '#333'
            }}
          >
            {(flipped.includes(card.id) || matched.includes(card.icon)) && card.icon}
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/games')} style={styles.backBtn}>← Back to Games</button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#001f3f',
    color: '#fff',
    padding: '30px',
    textAlign: 'center'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 60px)',
    gap: '15px',
    justifyContent: 'center',
    margin: '20px auto'
  },
  card: {
    width: '60px',
    height: '60px',
    fontSize: '30px',
    backgroundColor: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: '10px',
    transition: '0.3s',
    userSelect: 'none'
  },
  backBtn: {
    marginTop: '30px',
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: '#eee',
    color: '#000',
    border: 'none',
    cursor: 'pointer',
  }
};
