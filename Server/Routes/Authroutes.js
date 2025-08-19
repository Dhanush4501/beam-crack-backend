const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB limit

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, passwordHash });
    await user.save();

    const safeUser = { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt };
    res.status(201).json({ message: 'User registered successfully', user: safeUser });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: err.message || 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '7d' });

    const safeUser = { _id: user._id, name: user.name, email: user.email };
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message || 'Login failed' });
  }
});

// PUT /api/auth/profile
// Accepts JSON: { name, bio, photo } and (fallback) email in body
router.put('/profile', async (req, res) => {
  try {
    // If you have auth middleware, set req.userId there and prefer it.
    const userIdFromToken = req.userId; // optional: set by auth middleware
    const { email, name, bio, photo } = req.body;

    let user;
    if (userIdFromToken) {
      user = await User.findById(userIdFromToken);
    } else if (email) {
      user = await User.findOne({ email });
    } else {
      return res.status(400).json({ message: 'No user identifier provided' });
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;

    // photo can be a data URL (data:image/...) or a base64 string
    if (photo) {
      if (typeof photo === 'string' && photo.startsWith('data:')) {
        user.photo = photo;
      } else if (typeof photo === 'string') {
        // assume raw base64; store as data URL PNG by default
        user.photo = `data:image/png;base64,${photo}`;
      }
    }

    await user.save();

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      photo: user.photo
    };

    return res.json({ user: safeUser });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ message: err.message || 'Profile update failed' });
  }
});

module.exports = router;