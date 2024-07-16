const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    catway: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Catway',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    checkIn: {
        type: Date
    },
    checkOut: {
        type: Date
    },
    boatName: {
        type: String
    },
    clientName: {
        type: String
    },
    catwayNumber: {
        type: Number
    }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
