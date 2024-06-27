const express = require('express');
const router = express.Router();
const {
    getCatways,
    getCatway,
    createCatway,
    updateCatway,
    deleteCatway
} = require('../controllers/catwayController');

router.get('/', getCatways);
router.get('/:id', getCatway);
router.post('/', createCatway);
router.put('/:id', updateCatway);
router.patch('/:id', updateCatway);
router.delete('/:id', deleteCatway);

module.exports = router;
