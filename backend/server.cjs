const dotenv = require('dotenv');
dotenv.config({ path: './.env' });  // Load .env first
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);  // Should now show correct value

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.js');
const chatRoutes = require('./routes/chat.js');
const moodRoutes = require('./routes/moodRoutes');
const gameRoutes = require('./routes/games');
const diaryRoutes = require('./routes/diary');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/diary', diaryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));