const mongoose = require('mongoose');
const Catway = require('./models/Catway');
const Reservation = require('./models/Reservation');
const User = require('./models/User');

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/catways-reservation', { useNewUrlParser: true, useUnifiedTopology: true });

    // Suppression des anciennes données
    await Catway.deleteMany({});
    await Reservation.deleteMany({});
    await User.deleteMany({});

    // Ajout des nouvelles données
    const newCatways = await Catway.create([
      { name: 'Catway 1', description: 'Long catway' },
      { name: 'Catway 2', description: 'Short catway' }
    ]);

    const newUsers = await User.create([
      { username: 'user1', password: await bcrypt.hash('password1', 10) },
      { username: 'user2', password: await bcrypt.hash('password2', 10) }
    ]);

    await Reservation.create([
      { catway: newCatways[0]._id, user: newUsers[0]._id, date: new Date() },
      { catway: newCatways[1]._id, user: newUsers[1]._id, date: new Date() }
    ]);

    console.log('Base de données peuplée avec succès!');
    process.exit();
  } catch (error) {
    console.error('Erreur lors du peuplement de la base de données:', error);
    process.exit(1);
  }
}

seedDatabase();
