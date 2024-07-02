const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation'); // Assurez-vous que le modèle Reservation existe
const { check, validationResult } = require('express-validator');

// Exemple de route de création de réservation
router.post(
  '/',
  [
    check('user', 'User is required').not().isEmpty(),
    check('catway', 'Catway is required').not().isEmpty(),
    check('startTime', 'Start time is required').isISO8601(),
    check('endTime', 'End time is required').isISO8601()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user, catway, startTime, endTime } = req.body;

    try {
      const newReservation = new Reservation({
        user,
        catway,
        startTime,
        endTime
      });

      const reservation = await newReservation.save();
      res.status(201).json(reservation);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
