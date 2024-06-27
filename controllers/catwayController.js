const Joi = require('joi');
const Catway = require('../models/Catway');

const catwaySchema = Joi.object({
    catwayNumber: Joi.string().required(),
    type: Joi.string().valid('long', 'short').required(),
    catwayState: Joi.string().required()
  });

exports.getCatways = async (req, res) => {
    try {
        const catways = await Catway.find();
        res.json(catways);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCatway = async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        if (!catway) return res.status(404).json({ message: 'Catway not found' });
        res.json(catway);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCatway = async (req, res) => {
  const { error } = catwaySchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const newCatway = new Catway(req.body);
    await newCatway.save();
    res.status(201).json(newCatway);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateCatway = async (req, res) => {
    const { error } = catwaySchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
  
    try {
      const updatedCatway = await Catway.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedCatway) return res.status(404).json({ message: 'Catway not found' });
      res.json(updatedCatway);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

exports.patchCatway = async (req, res) => {
    try {
        const catway = await Catway.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!catway) return res.status(404).json({ message: 'Catway not found' });
        res.json(catway);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCatway = async (req, res) => {
    try {
        const catway = await Catway.findByIdAndDelete(req.params.id);
        if (!catway) return res.status(404).json({ message: 'Catway not found' });
        res.json({ message: 'Catway deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

