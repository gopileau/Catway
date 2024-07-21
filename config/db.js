const mongoose = require('mongoose');

const db = process.env.MONGODB_URI; // Utilisez process.env pour les variables d'environnement

let dbConnection;

const connectDB = async () => {
  if (!dbConnection) {
    try {
      dbConnection = await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected');
    } catch (err) {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    }
  }
  return dbConnection;
};

const closeDB = async () => {
  if (dbConnection) {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};

module.exports = { connectDB, closeDB };






