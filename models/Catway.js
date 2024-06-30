const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
    catwayNumber: { type: String, required: true },
    type: { type: String, required: true, enum: ['long', 'short'] },
    catwayState: { type: String, required: true }
});

module.exports = mongoose.model('Catway', catwaySchema);
