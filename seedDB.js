const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Catway = require('./models/Catway');
const Reservation = require('./models/Reservation');

mongoose.connect('mongodb://localhost:27017/catways-reservation', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedDB = async () => {
  try {
    // Suppression des données existantes
    await User.deleteMany({});
    await Catway.deleteMany({});
    await Reservation.deleteMany({});

    // Création d'un utilisateur
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const newUser = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: hashedPassword
    });
    await newUser.save();

    // Création d'un catway
    const newCatway = new Catway({
      number: '1',
      type: 'long',
      state: 'available'
    });
    await newCatway.save();

    // Création d'une réservation
    const newReservation = new Reservation({
      catway: newCatway._id,
      user: newUser._id,
      clientName: 'John Doe',
      boatName: 'SS Minnow',
      startTime: new Date(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      checkIn: new Date(),
      checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    await newReservation.save();

    console.log('Base de données peuplée avec succès');
  } catch (err) {
    console.error('Erreur lors du peuplement de la base de données :', err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
