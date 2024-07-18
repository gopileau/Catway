require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const catwayRoutes = require('./routes/catways');
const reservationRoutes = require('./routes/reservations');
const connectDB = require('./config/db');
const swaggerSetup = require('./swagger');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/catways', catwayRoutes);
app.use('/api/reservations', reservationRoutes);

// Static files
app.use(express.static('public'));

// Swagger documentation
swaggerSetup(app);

// Start server
async function startServer() {
  try {
    await connectDB(); // Se connecte à MongoDB en utilisant la configuration définie dans config/db.js
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();

module.exports = app;




