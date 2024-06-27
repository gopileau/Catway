const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const config = require('config');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const catwayRoutes = require('./routes/catways');
const reservationRoutes = require('./routes/reservations');
const connectDB = require('./config/db'); 
const swaggerSetup = require('./swagger');

dotenv.config();

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

// MongoDB Connection
async function startServer() {
    try {
      let dbConfig;
      if (process.env.NODE_ENV === 'test') {
        dbConfig = config.util.loadFileConfigs('./config/test.json');
        console.log('Using test configuration:', dbConfig);
        await connectDB(dbConfig.mongoURI); // Utilisation de la mongoURI de la config de test
      } else {
        // Utilisation de la configuration par défaut ou de l'environnement spécifié
        await connectDB(config.get('mongoURI')); // Utilisation de la mongoURI par défaut
      }
      console.log('MongoDB connected');
    } catch (err) {
      console.error('MongoDB connection error:', err.message);
      process.exit(1); // Arrêt de l'application en cas d'erreur de connexion
    }
  
    // Démarrer le serveur après la connexion réussie à MongoDB
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
  
  startServer();


