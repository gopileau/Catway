const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getCatways,
    getCatway,
    createCatway,
    updateCatway,
    patchCatway,
    deleteCatway
} = require('../controllers/catwayController');

router.get('/', getCatways);
router.get('/:id', getCatway);
router.post('/', createCatway);
router.put('/:id', updateCatway);
router.patch('/:id', patchCatway);
router.delete('/:id', deleteCatway);

router.put('/:id', auth, async (req, res) => {
    // Votre logique de mise à jour de l'utilisateur ici
  });
  
  // Protéger une route de suppression d'utilisateur
  router.delete('/:id', auth, async (req, res) => {
    // Votre logique de suppression de l'utilisateur ici
  });

module.exports = router;
