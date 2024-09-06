const Joi = require('joi');
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');
const Catway = require('../models/Catway');

// Schéma Joi pour validation des données
const reservationSchema = Joi.object({
    user: Joi.string().required(),
    catway: Joi.string().required(),
    clientName: Joi.string().required(),
    boatName: Joi.string().required(),
    startTime: Joi.date().iso().required(),
    endTime: Joi.date().iso().required(),
    checkIn: Joi.date().iso().required(),
    checkOut: Joi.date().iso().required()
});

exports.createReservation = async (req, res) => {
    const { id } = req.params;
    const reservationData = req.body;

    try {
        // Trouver le Catway par numéro de voie au lieu de l'ID
        const catway = await Catway.findOne({ voie: id });
        if (!catway) {
            return res.status(404).json({ message: 'Catway not found' });
        }

        const newReservation = new Reservation({
            catway: catway._id,
            user: reservationData.user,
            clientName: reservationData.clientName,
            boatName: reservationData.boatName,
            startTime: reservationData.startTime,
            endTime: reservationData.endTime,
            checkIn: reservationData.checkIn,
            checkOut: reservationData.checkOut
        });

        await newReservation.save();
        res.status(201).json(newReservation);
    } catch (error) {
        console.error('Error creating reservation:', error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.updateReservation = async (req, res) => {
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





