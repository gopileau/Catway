const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour hacher le mot de passe avant de sauvegarder l'utilisateur
UserSchema.pre('save', async function(next) {
  try {
    // Génération du sel
    const salt = await bcrypt.genSalt(10);
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(this.password, salt);
    // Remplacement du mot de passe non haché par le haché
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
