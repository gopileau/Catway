// services/reservationService.js

const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');

class ReservationService {
    async createReservation(data) {
        const newReservation = new Reservation(data);
        return await newReservation.save();
    }

    async updateReservation(id, data) {
        return await Reservation.findByIdAndUpdate(id, data, { new: true });
    }

    async getReservationById(id) {
        return await Reservation.findById(id).populate('catway');
    }

    async deleteReservation(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid reservation ID');
        }
        return await Reservation.findByIdAndDelete(id);
    }

    async getAllReservations() {
        return await Reservation.find().populate('catway');
    }
}

module.exports = new ReservationService();