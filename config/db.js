const mongoose = require('mongoose');

const dbUri = process.env.MONGODB_URI || 'mongodb+srv://vanessagonzalez99:nAF6LFlgTUcJWMtv@cluster0.ht5l6iy.mongodb.net/catways-reservation?retryWrites=true&w=majority';

async function connectDB() {
  try {
    if (!dbUri) {
      console.error('MONGODB_URI not defined in environment variables');
      process.exit(1);
    }

    console.log('Attempting to connect to MongoDB with URI:', dbUri);

    await mongoose.connect(dbUri, {
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

async function closeDB() {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err.message);
  }
}

module.exports = { connectDB, closeDB };






