const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');
const { check, validationResult } = require('express-validator');
const Joi = require('joi');
const { createReservation } = require('../controllers/reservationController');
const { deleteReservation } = require('../controllers/reservationController');
const reservationController = require('../controllers/reservationController');

// Route pour créer une réservation pour un catway spécifique
router.post(
  '/:catwayId/reservations',
  [
    check('user', 'User  is required').not().isEmpty(),
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
      const catwayExists = await Catway.findById(catwayId);
      if (!catwayExists) {
        return res.status(404).json({ message: 'Catway not found' });
      }

      const newReservation = new Reservation({
        user, // Assurez-vous que 'user' est bien défini dans le corps de la requête
        catway: catwayId,
        clientName,
        boatName,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut)
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


router.delete('/reservations/:id', deleteReservation);

// Route pour obtenir toutes les réservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', deleteReservation);

router.get('/:id', reservationController.getReservationDetails);

module.exports = router;
