const express = require('express');
const router = express.Router();
const Catway = require('../models/Catway');

// GET /catways
router.get('/', async (req, res) => {
  try {
    const catways = await Catway.find();
    res.json(catways);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /catways
router.post('/', async (req, res) => {
  const catway = new Catway(req.body);
  try {
    const newCatway = await catway.save();
    res.status(201).json(newCatway);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /catways/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedCatway = await Catway.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCatway);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /catways/:id
router.delete('/:id', async (req, res) => {
  try {
    await Catway.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
