const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createReservation } = require('../controllers/reservationController');
const {
    getCatways,
    getCatway,
    createCatway,
    updateCatway,
    patchCatway,
    deleteCatway
} = require('../controllers/catwayController');

// Routes pour les catways
router.get('/', getCatways);
router.get('/:id', getCatway);
router.post('/', createCatway);
router.put('/:id', updateCatway);
router.patch('/:id', patchCatway);
router.delete('/:id', deleteCatway);

// Route pour les réservations associées à un catway
router.post('/:id/reservations', createReservation);

module.exports = router;
