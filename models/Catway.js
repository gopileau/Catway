const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CatwaySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    catwayState: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['type1', 'type2', 'type3']
    },
    catwayNumber: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Catway', CatwaySchema);
