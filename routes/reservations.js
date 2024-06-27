const express = require('express');
const router = express.Router();
const {
    getReservations,
    getReservation,
    createReservation,
    deleteReservation
} = require('../controllers/reservationController');

router.get('/', getReservations); // Récupère toutes les réservations
router.get('/:id', getReservation); // Récupère les réservations pour un catway spécifique // Récupère une réservation spécifique
router.post('/', createReservation); // Crée une nouvelle réservation pour un catway
router.delete('/:id', deleteReservation); // Supprime une réservation spécifique

module.exports = router;
