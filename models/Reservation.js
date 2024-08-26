const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  catway: { type: mongoose.Schema.Types.ObjectId, ref: 'Catway', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientName: { type: String, required: true },
  boatName: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  // Ajoutez d'autres champs si nécessaire
});

// Vérifiez si le modèle existe déjà
module.exports = mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);
