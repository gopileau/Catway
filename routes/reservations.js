const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');
const { check, validationResult } = require('express-validator');
const { createReservation } = require('../controllers/reservationController');


// Route pour créer une réservation pour un catway spécifique
router.post(
  '/:catwayId/reservations',
  [
    check('user', 'User is required').not().isEmpty(),
    check('startTime', 'Start time is required').isISO8601(),
    check('endTime', 'End time is required').isISO8601(),
    check('clientName', 'Client name is required').not().isEmpty(),
    check('boatName', 'Boat name is required').not().isEmpty(),
    check('checkIn', 'Check-in date is required').isISO8601(),
    check('checkOut', 'Check-out date is required').isISO8601()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user, clientName, boatName, startTime, endTime, checkIn, checkOut } = req.body;
    const { catwayId } = req.params;

    try {
      console.log('Request body:', req.body);
      console.log(`Searching for catway with ID: ${catwayId}`);

      const catwayExists = await Catway.findById(catwayId);
      if (!catwayExists) {
        console.log('Catway not found');
        return res.status(404).json({ message: 'Catway not found' });
      }

      // Convertir l'ID utilisateur en ObjectId
      const ObjectId = mongoose.Types.ObjectId;
      if (!ObjectId.isValid(user)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      const userId = new ObjectId(user);

      // Convertir les chaînes de caractères en objets Date
      const startTimeDate = new Date(startTime);
      const endTimeDate = new Date(endTime);
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      // Vérifier si les dates sont valides
      if (isNaN(startTimeDate) || isNaN(endTimeDate) || isNaN(checkInDate) || isNaN(checkOutDate)) {
        return res.status(400).json({ message: 'Invalid date format' });
      }

      // Validation supplémentaire sur les dates
      if (startTimeDate >= endTimeDate) {
        return res.status(400).json({ message: 'Start time must be before end time' });
      }
      if (checkInDate >= checkOutDate) {
        return res.status(400).json({ message: 'Check-in date must be before check-out date' });
      }

      // Créez la réservation
      const newReservation = new Reservation({
        user: userId,
        catway: catwayId,
        clientName,
        boatName,
        startTime: startTimeDate,
        endTime: endTimeDate,
        checkIn: checkInDate,
        checkOut: checkOutDate
      });

      const reservation = await newReservation.save();
      res.status(201).json(reservation);
    } catch (err) {
      console.error('Error creating reservation:', err.message);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);


// Route pour mettre à jour une réservation
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  // Validation des données
  const { error } = reservationSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedReservation) return res.status(404).json({ message: 'Reservation not found' });
    res.json(updatedReservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour supprimer une réservation
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  console.log('ID de la réservation à supprimer:', id);  // Log l'ID reçu

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('ID non valide:', id);  // Log si l'ID est invalide
    return res.status(400).json({ message: 'Invalid reservation ID' });
  }

  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      console.log('Réservation non trouvée pour cet ID:', id);  // Log si la réservation n'est pas trouvée
      return res.status(404).json({ message: 'Reservation not found' });
    }

    await reservation.remove();
    console.log('Réservation supprimée avec succès:', id);  // Log après la suppression
    res.json({ message: 'Reservation deleted' });
  } catch (err) {
    console.error('Erreur lors de la suppression de la réservation:', err.message);  // Log les erreurs du serveur
    res.status(500).json({ message: err.message });
  }
});


// Route pour obtenir toutes les réservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour obtenir une réservation par ID
router.get('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
