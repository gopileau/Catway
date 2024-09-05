const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');
const { check, validationResult } = require('express-validator');

// Route pour créer une réservation
router.post(
  '/',
  [
    check('user', 'User is required').not().isEmpty(),
    check('catway', 'Catway is required').not().isEmpty(),
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

    const { user, catway, clientName, boatName, startTime, endTime, checkIn, checkOut } = req.body;

    try {
      // Vérifiez que le catway existe
      const catwayExists = await Catway.findById(catway);
      if (!catwayExists) return res.status(404).json({ message: 'Catway not found' });

      // Créez la réservation
      const newReservation = new Reservation({
        user,
        catway,
        clientName,
        boatName,
        startTime,
        endTime,
        checkIn,
        checkOut
      });

      const reservation = await newReservation.save();
      res.status(201).json(reservation);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Route pour obtenir toutes les réservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('catway') 
      .populate('user');  
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
  }
});

// Route pour obtenir les réservations pour un catway spécifique
router.get('/catway/:catwayId', async (req, res) => {
  const { catwayId } = req.params;

  try {
    const reservations = await Reservation.find({ catway: catwayId })
      .populate('catway') 
      .populate('user');
    
    if (reservations.length === 0) {
      return res.status(404).json({ message: 'No reservations found for this catway' });
    }

    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
  }
});

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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid reservation ID' });
  }

  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    await reservation.remove();
    res.json({ message: 'Reservation deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
