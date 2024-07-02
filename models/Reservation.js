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
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    boatName: {
        type: String,
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    catwayNumber: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
