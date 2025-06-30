const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth'); // your JWT verification middleware

// POST /api/games/streak - update user's game streak
router.post('/streak', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const today = new Date().toISOString().split('T')[0];
    const lastPlayed = user.gameLastPlayed ? user.gameLastPlayed.toISOString().split('T')[0] : null;

    if (lastPlayed === today) {
      return res.json({ streak: user.gameStreakCount });
    }

    const diffDays = lastPlayed
      ? Math.floor((new Date(today) - new Date(lastPlayed)) / (1000 * 60 * 60 * 24))
      : null;

    if (diffDays === 1) {
      user.gameStreakCount += 1;
    } else {
      user.gameStreakCount = 1;
    }

    user.gameLastPlayed = new Date();
    await user.save();

    res.json({ streak: user.gameStreakCount });
  } catch (err) {
    console.error('Error updating game streak:', err);
    res.status(500).json({ msg: 'Failed to update streak' });
  }
});

module.exports = router;
