const Joi = require('joi');
const Catway = require('../models/Catway');
const mongoose = require('mongoose');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log' }),
  ],
});

const catwaySchema = Joi.object({
  catwayNumber: Joi.string().required(),
  type: Joi.string().valid('long', 'short').required(),
  catwayState: Joi.string().required()
});


exports.getCatways = async (req, res) => {
  try {
    const catways = await Catway.find().select('number type state');
    console.log(catways); // Ajouter cette ligne de code
    return catways.map(catway => ({
      catwayNumber: catway.number ? catway.number.toString() : 'N/A',
      type: catway.type,
      catwayState: catway.state
    }));
  } catch (error) {
    throw error;
  }
};

exports.getCatway = async (id) => {
  try {
    const catway = await Catway.findById(id).select('number type state');
    if (!catway) {
      throw new Error('Catway not found');
    }
    return {
      catwayNumber: catway.number,
      type: catway.type,
      catwayState: catway.state
    };
  } catch (error) {
    throw error;
  }
};
exports.createCatway = async (req, res) => {
  const { error } = catwaySchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
   
    const newCatway = new Catway({
      number: req.body.catwayNumber,
      type: req.body.type,
      state: req.body.catwayState,
    });

    await newCatway.save();
    console.log(`Catway created with ID: ${newCatway._id}`);
    res.status(201).json(newCatway);
  } catch (err) {
    console.error('Error while creating Catway:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};



exports.updateCatway = async (req, res) => {
  const catwayId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(catwayId)) {
    return res.status(400).json({ message: "Invalid Catway ID" });
  }

  try {
    const updatedCatway = await Catway.findByIdAndUpdate(catwayId, req.body, { new: true });
    if (!updatedCatway) {
      return res.status(404).json({ message: "Catway not found" });
    }
    res.status(200).json(updatedCatway);
  } catch (error) {
    console.error('Error while updating Catway:', error);
    res.status(500).json({ message: "An error occurred while updating the Catway" });
  }
};


exports.deleteCatway = async (req, res) => {
  const catwayId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(catwayId)) {
    return res.status(400).json({ message: "Invalid Catway ID" });
  }

  try {
    const deletedCatway = await Catway.findByIdAndDelete(catwayId);
    if (!deletedCatway) {
      return res.status(404).json({ message: "Catway not found" });
    }
    res.status(200).json({ message: "Catway deleted successfully", catway: deletedCatway });
  } catch (error) {
    console.error('Error while deleting Catway:', error);
    res.status(500).json({ message: "An error occurred while deleting the Catway" });
  }
};




exports.patchCatway = async (req, res) => {
  try {
    const id = req.params.id;
    const catway = await Catway.findById(id);
    if (!catway) {
      return res.status(404).json({ message: 'Catway not found' });
    }
    if (req.body.number) catway.number = req.body.number;
    if (req.body.type) catway.type = req.body.type;
    if (req.body.state) catway.state = req.body.state;
    await catway.save();
    res.json(catway);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  

  
  
  
  

