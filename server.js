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
        let mongoURI;
        if (process.env.NODE_ENV === 'test') {
            mongoURI = config.get('mongoURI'); 
        } else {
            mongoURI = config.get('mongoURI'); 
        }
        await connectDB(mongoURI); 
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




