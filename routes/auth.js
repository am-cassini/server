const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, institutionalEmail, password } = req.body;

  try {
    const existing = await User.findOne({ institutionalEmail });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      institutionalEmail,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'Account created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { institutionalEmail, password } = req.body;

  try {
    const user = await User.findOne({ institutionalEmail });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { institutionalEmail: user.institutionalEmail },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { name: user.name, institutionalEmail: user.institutionalEmail } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login error' });
  }
});

module.exports = router;

