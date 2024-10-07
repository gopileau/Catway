const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');
const { check, validationResult } = require('express-validator');
const Joi = require('joi');
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

// Suppression d'une réservation par son ID
router.delete('/:catwayId/reservations/:reservationId', async (req, res) => {
  const { catwayId, reservationId } = req.params;

  try {
    const reservation = await Reservation.findByIdAndDelete(reservationId);
    if (!reservation) {
      return res.status(404).send('Reservation not found');
    }
    res.status(200).send(reservation);
  } catch (error) {
    res.status(400).send('Error deleting reservation');
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
