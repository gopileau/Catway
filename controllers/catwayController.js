const Joi = require('joi');
const Catway = require('../models/Catway');
const mongoose = require('mongoose');
const winston = require('winston');

// Logger configuration
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log' }),
  ],
});

// Catway schema validation
const catwaySchema = Joi.object({
  catwayNumber: Joi.string().required(),
  type: Joi.string().valid('long', 'short').required(),
  catwayState: Joi.string().required()
});

/**
 * Get all catways.
 * @function getCatways
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Array>} List of catways.
 */
exports.getCatways = async (req, res) => {
  try {
    const catways = await Catway.find().select('number type state');
    console.log(catways);
    return catways.map(catway => ({
      catwayNumber: catway.number ? catway.number.toString() : 'N/A',
      type: catway.type,
      catwayState: catway.state
    }));
  } catch (error) {
    throw error;
  }
};

/**
 * Get details of a specific catway by ID.
 * @function getCatwayDetails
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} Details of the requested catway.
 */
exports.getCatwayDetails = async (req, res) => {
  console.log('ID du catway reçu :', req.params.id); 
  try {
    const catway = await Catway.findById(req.params.id);
    console.log('Catway trouvé :', catway); 
    if (!catway) {
      return res.status(200).json({
        message: 'Catway not found',
        id: req.params.id,
        number: 'N/A',
        type: 'N/A',
        state: 'N/A'
      });
    }
    res.status(200).json(catway);
  } catch (error) {
    console.error('Erreur lors de la récupération du catway:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a new catway.
 * @function createCatway
 * @async
 * @param {Object} req - Express request object containing the catway data.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} The created catway.
 */
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

    // Réponse avec l'ID du catway créé
    res.status(201).json({
      message: `Catway created successfully`,
      id: newCatway._id.toString(), // Assurez-vous d'inclure l'ID ici sous forme de chaîne
      catway: newCatway // Vous pouvez également renvoyer l'objet complet si nécessaire
    });
  } catch (err) {
    console.error('Error while creating Catway:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Update a specific catway by ID.
 * @function updateCatway
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<string>} Success message.
 */
exports.updateCatway = async (req, res) => {
  const id = req.params.id;
  const number = req.body.number;
  const type = req.body.type;
  const state = req.body.state;

  try {
    const catway = await Catway.findByIdAndUpdate(id, { number, type, state }, { new: true });
    res.send(`Catway mis à jour avec succès`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete a specific catway by ID.
 * @function deleteCatway
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<string>} Success message.
 */
exports.deleteCatway = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedCatway = await Catway.findByIdAndDelete(id);
    res.send(`Catway supprimé avec succès`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Partially update a specific catway by ID.
 * @function patchCatway
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} The updated catway.
 */
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


  

  
  
  
  

