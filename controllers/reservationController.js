const Joi = require('joi');
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');

exports.getReservations = async (req, res) => {
    try {
        const catwayId = req.params.id;
        const filter = catwayId ? { catwayNumber: catwayId } : {};
        const reservations = await Reservation.find(filter);
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getReservation = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid reservation ID' });
    }

    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
        res.json(reservation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createReservation = async (req, res) => {
    const { error } = reservationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const reservationSchema = Joi.object({
        catwayNumber: Joi.string().required(),
        clientName: Joi.string().required(),
        boatName: Joi.string().required(),
        checkIn: Joi.date().required(),
        checkOut: Joi.date().required()
      });

      try {
        const newReservation = new Reservation(req.body);
        await newReservation.save();
        res.status(201).json(newReservation);
      } catch (err) {
        res.status(500).json({ message: err.message });
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






