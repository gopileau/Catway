const express = require('express');
const router = express.Router();
const {
    getReservations,
    getReservation,
    createReservation,
    updateReservation,
    deleteReservation
} = require('../controllers/reservationController');

router.get('/', getReservations);
router.get('/:id', getReservation);
router.post('/:catwayId/reservations', createReservation); // Utilisation du catwayId pour lier la réservation à un catway
router.put('/:id', updateReservation);
router.delete('/:id', deleteReservation);

module.exports = router;
