
const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['long', 'short'],
  },
  state: {
    type: String,
    required: true,
  },
});

const Catway = mongoose.model('Catway', catwaySchema);

module.exports = Catway;