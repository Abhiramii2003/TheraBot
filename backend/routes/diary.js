const express = require('express');
const router = express.Router();
const DiaryEntry = require('../models/Diary'); // rename to match the model you kept

const auth = require('../middleware/auth');

// Save diary entry
router.post('/save', auth, async (req, res) => {
  try {
    const newEntry = new DiaryEntry({ userId: req.user.id, ...req.body });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ msg: 'Error saving entry' });
  }
});

// Get all entries for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const entries = await DiaryEntry.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching entries' });
  }
});

module.exports = router;
