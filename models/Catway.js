const mongoose = require('mongoose');

const CatwaySchema = new mongoose.Schema({
  number: { type: String, required: true },
  type: { type: String, required: true },
  state: { type: String, required: true }
  // Ajoutez d'autres champs si nécessaire
});

// Vérifiez si le modèle existe déjà
module.exports = mongoose.models.Catway || mongoose.model('Catway', CatwaySchema);
