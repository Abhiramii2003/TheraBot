// models/Diary.js
const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  font: String,
  textColor: String,
  bgColor: String,
  backgroundTheme: String, // optional field
  stickers: [String],      // emoji, image URLs, etc.
  image: String,           // base64 or URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Diary', diarySchema);
