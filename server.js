require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const methodOverride = require('method-override');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const catwayRoutes = require('./routes/catways');
const reservationRoutes = require('./routes/reservations');
const { connectDB, closeDB } = require('./config/db');
const swaggerSetup = require('./swagger');
const path = require('path'); 

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Permettre les requêtes CORS
app.use(methodOverride('_method')); // Permettre la méthode HTTP à partir d'un paramètre
app.use(express.urlencoded({ extended: true })); // Parser les données URL-encoded
app.use(bodyParser.json()); // Parser les données JSON
app.use(morgan('dev')); // Logger les requêtes HTTP

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Configuration du moteur de vue et du répertoire des vues
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/catways', catwayRoutes);
app.use('/api/reservations', reservationRoutes);

// Fichiers statiques
app.use(express.static('public'));
app.use('/docs', express.static(path.join(__dirname, 'docs'))); // Documentation Swagger

// Configuration de Swagger
swaggerSetup(app);

let server;

// Fonction pour démarrer le serveur
async function startServer(callback) {
  try {
    await connectDB(); // Connexion à la base de données
    server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      if (callback) callback();
    });
  } catch (err) {
    console.error('Error starting server:', err.message);
    process.exit(1); // Quitter le processus en cas d'erreur
  }
}

// Démarrer le serveur si ce fichier est exécuté directement
if (require.main === module) {
  startServer();
}

// Exporter l'application et les fonctions pour les tests ou d'autres modules
module.exports = { app, startServer, server, closeDB };