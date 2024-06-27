const mongoose = require('mongoose');

const CatwaySchema = new mongoose.Schema({
    catwayNumber: { type: Number, required: true, unique: true },
    type: { type: String, required: true },
    catwayState: { type: String, required: true }
});

module.exports = mongoose.model('Catway', CatwaySchema);
