const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [String],         // ['Happy', 'Yes', 'No']
  moodResult: String,        // "😊 You’re feeling great!"
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Mood', moodSchema);
