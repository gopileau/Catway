const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Catway = require('../models/Catway');
const mongoose = require('mongoose');
const catwayController = require('../controllers/catwayController'); 
const reservationController = require('../controllers/reservationController'); 
const { createReservation } = require('../controllers/reservationController');
const {
    getCatways,
    getCatway,
    createCatway,
    updateCatway,
    patchCatway,
    deleteCatway
} = require('../controllers/catwayController');  // Import unique

// Route pour obtenir tous les catways
router.get('/', async (req, res) => {
  try {
    const catways = await Catway.find();
    res.json(catways);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Route pour obtenir un catway par ID
router.get('/:id', catwayController.getCatwayDetails);

// Route pour créer un catway
router.post('/', createCatway);

// Route pour mettre à jour un catway par ID
router.patch('/:id', updateCatway);


// Route pour créer une réservation pour un catway spécifique
router.post('/:catwayId/reservations', createReservation);

router.delete('/:id', deleteCatway);

router.post('/:catwayId/reservations', createReservation);

router.delete('/reservations/:id', reservationController.deleteReservation);

module.exports = router;