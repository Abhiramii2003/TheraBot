import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import './Diary.css';

const fonts = [
  { name: 'Arial', category: 'Modern' },
  { name: 'Georgia', category: 'Serif' },
  { name: 'Courier New', category: 'Monospace' },
  { name: 'Comic Sans MS', category: 'Casual' },
  { name: 'Times New Roman', category: 'Classic' },
  { name: 'Poppins', category: 'Modern' },
  { name: 'Dancing Script', category: 'Handwriting' }
];

const colorPresets = [
  '#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', 
  '#B5EAD7', '#C7CEEA', '#F8B195', '#F67280',
  '#C06C84', '#6C5B7B', '#355C7D', '#2A363B'
];

const stickers = ['🌸', '💖', '🌈', '✨', '🧸', '🍀', '🎀', '🦋', '⭐', '🎉'];

export default function Diary() {
  const [text, setText] = useState('');
  const [font, setFont] = useState(fonts[0].name);
  const [textColor, setTextColor] = useState('#2d3436');
  const [bgColor, setBgColor] = useState('#f5f5f5');
  const [bgImage, setBgImage] = useState(null);
  const [image, setImage] = useState(null);
  const [addedStickers, setAddedStickers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [activeTab, setActiveTab] = useState('create');
  const [isSaving, setIsSaving] = useState(false);

  const diaryRef = useRef();

  const handleBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBgImage(URL.createObjectURL(file));
      setBgColor('transparent');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const addSticker = (emoji) => {
    setAddedStickers([...addedStickers, { 
      emoji, 
      x: Math.random() * 70 + 15, 
      y: Math.random() * 70 + 15,
      rotation: Math.random() * 60 - 30
    }]);
  };

  const moveSticker = (e, index) => {
    const rect = diaryRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const updated = [...addedStickers];
    updated[index] = {
      ...updated[index],
      x,
      y
    };
    setAddedStickers(updated);
  };

  const rotateSticker = (e, index, direction) => {
    e.stopPropagation();
    const updated = [...addedStickers];
    updated[index] = {
      ...updated[index],
      rotation: updated[index].rotation + (direction === 'right' ? 15 : -15)
    };
    setAddedStickers(updated);
  };

  const removeSticker = (e, index) => {
    e.stopPropagation();
    const updated = [...addedStickers];
    updated.splice(index, 1);
    setAddedStickers(updated);
  };

  const downloadDiary = async () => {
    const canvas = await html2canvas(diaryRef.current);
    const link = document.createElement('a');
    link.download = `diary-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleSaveDiary = async () => {
    if (!text.trim()) {
      alert('Please write something before saving!');
      return;
    }

    setIsSaving(true);
    const diaryData = {
      text,
      font,
      textColor,
      bgColor,
      bgImage,
      image,
      addedStickers,
      createdAt: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/diary/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(diaryData),
      });

      const result = await res.json();
      if (res.ok) {
        setText('');
        setImage(null);
        setAddedStickers([]);
        fetchDiaryEntries();
      } else {
        alert(`Failed to save diary: ${result.msg}`);
      }
    } catch (err) {
      console.error('Error saving diary:', err);
      alert('An error occurred while saving your diary.');
    } finally {
      setIsSaving(false);
    }
  };

  const fetchDiaryEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/diary', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error('Failed to fetch diary entries:', err);
    }
  };

  const clearDiary = () => {
    setText('');
    setImage(null);
    setAddedStickers([]);
    setBgImage(null);
    setBgColor('#f5f5f5');
  };

  useEffect(() => {
    fetchDiaryEntries();
  }, []);

  return (
    <div className="diary-app">
      <div className="diary-header">
        <h1>My Personal Diary</h1>
        <div className="tabs">
          <button 
            className={activeTab === 'create' ? 'active' : ''}
            onClick={() => setActiveTab('create')}
          >
            New Entry
          </button>
          <button 
            className={activeTab === 'entries' ? 'active' : ''}
            onClick={() => setActiveTab('entries')}
          >
            Past Entries
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="diary-creator">
          <div className="editor-controls">
            <div className="control-section">
              <h3>Customize</h3>
              <div className="control-group">
                <label>Font Style</label>
                <select 
                  onChange={(e) => setFont(e.target.value)} 
                  value={font}
                  className="font-select"
                >
                  {fonts.map((f, i) => (
                    <option key={i} value={f.name}>{f.name} ({f.category})</option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label>Text Color</label>
                <div className="color-options">
                  <input 
                    type="color" 
                    onChange={(e) => setTextColor(e.target.value)} 
                    value={textColor} 
                  />
                  <div className="color-presets">
                    {colorPresets.map((color, i) => (
                      <button 
                        key={i}
                        style={{ backgroundColor: color }}
                        onClick={() => setTextColor(color)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="control-group">
                <label>Background</label>
                <div className="bg-options">
                  <input 
                    type="color" 
                    onChange={(e) => { setBgColor(e.target.value); setBgImage(null); }} 
                    value={bgColor} 
                  />
                  <label className="file-upload">
                    Upload Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleBgUpload} 
                      hidden 
                    />
                  </label>
                </div>
              </div>

              <div className="control-group">
                <label>Add Photo</label>
                <label className="file-upload">
                  Choose Image
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    hidden 
                  />
                </label>
              </div>
            </div>

            <div className="control-section">
              <h3>Stickers</h3>
              <div className="sticker-palette">
                {stickers.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => addSticker(s)}
                    className="sticker-option"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="action-buttons">
              <button 
                onClick={clearDiary}
                className="secondary"
              >
                Clear
              </button>
              <button 
                onClick={handleSaveDiary}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Entry'}
              </button>
              <button 
                onClick={downloadDiary}
                className="secondary"
              >
                Download
              </button>
            </div>
          </div>

          <div
            className="diary-paper"
            ref={diaryRef}
            style={{
              fontFamily: font,
              color: textColor,
              backgroundColor: bgImage ? 'transparent' : bgColor,
              backgroundImage: bgImage ? `url(${bgImage})` : 'none',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          >
            <textarea
              className="diary-textarea"
              style={{ fontFamily: font, color: textColor }}
              placeholder="Write your heart out..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {image && (
              <div className="image-container">
                <img src={image} alt="Uploaded" className="diary-image" />
              </div>
            )}

            {addedStickers.map((s, i) => (
              <div
                key={i}
                className="sticker"
                style={{ 
                  left: `${s.x}%`, 
                  top: `${s.y}%`,
                  transform: `rotate(${s.rotation}deg)`,
                  fontSize: '2rem',
                  cursor: 'grab'
                }}
                onMouseDown={(e) => moveSticker(e, i)}
              >
                {s.emoji}
                <div className="sticker-controls">
                  <button onClick={(e) => rotateSticker(e, i, 'left')}>↺</button>
                  <button onClick={(e) => rotateSticker(e, i, 'right')}>↻</button>
                  <button onClick={(e) => removeSticker(e, i)}>×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="entries-container">
          {entries.length === 0 ? (
            <div className="empty-state">
              <p>No entries yet. Start writing your first diary entry!</p>
              <button onClick={() => setActiveTab('create')}>
                Create New Entry
              </button>
            </div>
          ) : (
            <div className="entries-grid">
              {entries.map((entry, i) => (
                <div 
                  key={i} 
                  className="entry-card"
                  style={{
                    backgroundColor: entry.bgColor,
                    fontFamily: entry.font,
                    color: entry.textColor,
                    backgroundImage: entry.bgImage ? `url(${entry.bgImage})` : 'none',
                  }}
                >
                  <div className="entry-content">
                    <p>{entry.text}</p>
                    {entry.image && (
                      <img 
                        src={entry.image} 
                        alt="Entry" 
                        className="entry-image" 
                      />
                    )}
                    {entry.addedStickers?.map((s, j) => (
                      <span 
                        key={j} 
                        className="entry-sticker"
                        style={{ transform: `rotate(${s.rotation || 0}deg)` }}
                      >
                        {s.emoji}
                      </span>
                    ))}
                  </div>
                  <div className="entry-date">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}