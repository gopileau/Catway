require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const catwayRoutes = require('./routes/catways');
const reservationRoutes = require('./routes/reservations');
const { connectDB, closeDB } = require('./config/db');
const swaggerSetup = require('./swagger');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/catways', catwayRoutes);
app.use('/api/reservations', reservationRoutes);

// Static files
app.use(express.static('public'));

// Swagger documentation
swaggerSetup(app);

let server;

async function startServer(callback) {
  try {
    await connectDB();
    server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      if (callback) callback();
    });
  } catch (err) {
    console.error('Error starting server:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer, server, closeDB };


