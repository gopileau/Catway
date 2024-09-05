const mongoose = require('mongoose');

const Joi = require('joi');

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


// Vérifiez si le modèle existe déjà
module.exports = mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);
