const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Catway = require('../models/Catway');
const mongoose = require('mongoose');
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
router.get('/:id', async (req, res) => {
  try {
    const catwayId = req.params.id; // Récupère l'ID du catway à partir des paramètres
    const catway = await Catway.findById(catwayId); // Recherche le catway dans la base de données

    if (!catway) {
      return res.status(404).json({ message: 'Catway not found' }); // Si le catway n'est pas trouvé
    }

    res.json(catway); // Retourne le catway
  } catch (error) {
    res.status(500).json({ error: error.message }); // Gère les erreurs
  }
});


// Route pour créer un catway
router.post('/', createCatway);

// Route pour mettre à jour un catway par ID
router.patch('/:id', updateCatway);


// Route pour créer une réservation pour un catway spécifique
router.post('/:catwayId/reservations', createReservation);

module.exports = router;