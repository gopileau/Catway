const Joi = require('joi');
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');
const Catway = require('../models/Catway');
const reservationController = require('../controllers/reservationController'); 


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
    const { user, clientName, boatName, startTime, endTime, checkIn, checkOut } = req.body;
    const { catwayId } = req.params; 

    const newReservation = new Reservation({
      user, 
      catway: catwayId, 
      clientName,
      boatName,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut)
    });
  
    try {
      const savedReservation = await newReservation.save();
      res.status(201).json(savedReservation);
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      res.status(500).json({ error: error.message });
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


exports.getReservationDetails = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate('catway'); 
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json(reservation);
    } catch (err) {
        console.error('Erreur lors de la récupération des détails de la réservation:', err);
        res.status(500).json({ message: err.message });
    }
};


exports.deleteReservation = async (req, res) => {
    const id = req.params.id; 
    console.log('Tentative de suppression de la réservation avec ID:', id); 
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid reservation ID' });
    }

    try {
      
        const deletedReservation = await Reservation.findByIdAndDelete(id);
        
        if (!deletedReservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json({ message: 'Reservation deleted successfully' });
    } catch (err) {
        console.error('Erreur lors de la suppression de la réservation:', err);
        res.status(500).json({ message: err.message });
    }
};






