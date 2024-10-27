const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

let dbConnection;

const connectDB = async () => {
  if (!dbConnection) {
    try {
      dbConnection = await mongoose.connect(process.env.MONGODB_URI);
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






