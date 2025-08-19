const express = require('express');
const router = express.Router();
const BeamData = require('../Models/BeamData');

// Create data
router.post('/', async (req, res) => {
  try {
    // allow frontend to send userEmail (or set from req.userId when auth middleware is added)
    const payload = { ...req.body };
    if (req.userId && !payload.user) payload.user = req.userId;
    if (!payload.userEmail && req.userEmail) payload.userEmail = req.userEmail;
    const newData = new BeamData(payload);
    const saved = await newData.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all data (optionally filter by ?email=someone@example.com or ?userId=...)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.email) filter.userEmail = req.query.email;
    const list = await BeamData.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error('Get beamdata error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const updated = await BeamData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Data not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await BeamData.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Data not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
