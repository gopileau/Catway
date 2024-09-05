const mongoose = require('mongoose');

const CatwaySchema = new mongoose.Schema({
  number: { type: String, required: true },
  type: { type: String, required: true },
  state: { type: String, required: true }
  // Ajoutez d'autres champs si nécessaire
});
const newCatway = {
  number: '123',      // Correspond à `number` dans le schéma Mongoose et Joi
  type: 'long',       // Correspond à `type` dans le schéma Mongoose et Joi
  state: 'active'     // Correspond à `state` dans le schéma Mongoose et Joi
};


// Vérifiez si le modèle existe déjà
module.exports = mongoose.models.Catway || mongoose.model('Catway', CatwaySchema);
