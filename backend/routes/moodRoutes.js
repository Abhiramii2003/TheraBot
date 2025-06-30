const express = require('express');
const Mood = require('../models/Mood');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Access Denied: No token provided' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Invalid Token' });
  }
};

// POST /api/mood/submit
router.post('/submit', verifyToken, async (req, res) => {
  try {
    const { answers, moodResult } = req.body;

    const newMood = new Mood({
      user: req.user.id,
      answers,
      moodResult,
    });

    await newMood.save();
    res.status(201).json({ msg: 'Mood result saved successfully' });
  } catch (err) {
    console.error('Mood submit error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
