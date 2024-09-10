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
} = require('../controllers/catwayController');  // Une seule fois les imports

// Routes pour les catways
router.get('/', getCatways);
router.get('/:id', getCatway);
router.post('/', createCatway);
router.put('/:id', updateCatway);
router.patch('/:id', patchCatway);
router.delete('/:id', deleteCatway);

// Route pour créer une réservation pour un catway spécifique
router.post('/:catwayId/reservations', createReservation);

module.exports = router;
