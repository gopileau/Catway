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

const validateReservation = (data) => {
    const { error } = reservationSchema.validate(data);
    if (error) {
        throw new Error(`Validation Error: ${error.details.map(x => x.message).join(', ')}`);
    }
};
