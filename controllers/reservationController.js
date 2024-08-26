const Joi = require('joi');
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');

// Définition du schéma Joi pour validation des données
const reservationSchema = Joi.object({
    user: Joi.string().required(),
    catway: Joi.string().required(),
    startTime: Joi.date().iso().required(),
    endTime: Joi.date().iso().required()
});

exports.getReservations = async (req, res) => {
    try {
        const catwayId = req.params.id;
        const filter = catwayId ? { catway: catwayId } : {};
        const reservations = await Reservation.find(filter);
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getReservations = async (req, res) => {
    try {
        const catwayId = req.params.id;
        const filter = catwayId ? { catwayNumber: catwayId } : {};
        const reservations = await Reservation.find(filter);
        res.json(reservations);  // Vérifiez que les données envoyées sont correctes
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.createReservation = async (req, res) => {
    // Validation des données
    const { error } = reservationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        // Création d'une nouvelle réservation
        const newReservation = new Reservation({
            user: req.body.user,
            catway: req.body.catway,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        });
        await newReservation.save();
        res.status(201).json(newReservation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateReservation = async (req, res) => {
    // Validation des données
    const { error } = reservationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReservation) return res.status(404).json({ message: 'Reservation not found' });
        res.json(updatedReservation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteReservation = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid reservation ID' });
    }

    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

        await reservation.remove();
        res.json({ message: 'Reservation deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};






