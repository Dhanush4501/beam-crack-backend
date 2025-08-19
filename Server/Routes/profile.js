const express = require('express');
const router = express.Router();
const Profile = require('../Models/Profilemo'); // Import your Mongoose model

// Update or create profile by email
router.put('/profile', async (req, res) => {
  const { email, name, bio, photo } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const user = await Profile.findOneAndUpdate(
      { email },
      { name, bio, photo },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Get profile by email
router.get('/profile', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const user = await Profile.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

module.exports = router;