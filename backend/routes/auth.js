const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cUser = require('../models/User.js'); // ✅ correct import

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await cUser.findOne({ email }); // ✅ fix here
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new cUser({ name, email, password: hashedPassword }); // ✅ fix here

    await newUser.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error("Registration error:", err); // 👈 Add this for debugging
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await cUser.findOne({ email }); // ✅ fix here
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err); // 👈 Add this for debugging
    res.status(500).json({ msg: 'Server error' });
  }
});


// Add this below your existing routes
const authMiddleware = require('../middleware/auth'); // Make sure this exists

router.get('/streak', authMiddleware, async (req, res) => {
  try {
    const user = await cUser.findById(req.user.id);
    res.json({ streak: user.gameStreakCount || 0 });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching streak' });
  }
});


module.exports = router;
