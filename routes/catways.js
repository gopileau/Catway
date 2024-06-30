const express = require('express');
const router = express.Router();
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

module.exports = router;
