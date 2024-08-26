const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Catway = require('./models/Catway');
const Reservation = require('./models/Reservation');
const User = require('./models/User');

async function importData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/catways-reservation');

    const catwaysData = JSON.parse(fs.readFileSync(path.join(__dirname, 'catways.json'), 'utf-8'));
    const reservationsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'reservations.json'), 'utf-8'));
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));

    await Catway.deleteMany();
    await Reservation.deleteMany();
    await User.deleteMany();

    await Catway.insertMany(catwaysData);
    await Reservation.insertMany(reservationsData);
    await User.insertMany(usersData);

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importData();
