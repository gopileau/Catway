const path = require('path');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require(path.resolve(__dirname, './server'));
const { Types: { ObjectId } } = require('mongoose');
const User = require('../models/User');
const fs = require('fs');

// Chargez le fichier de configuration JSON depuis config/test.json
const configPath = path.resolve(__dirname, '../config/test.json'); // Utilisez le chemin correct vers test.json
const configFile = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configFile);

let server;

beforeAll(async () => {
    // Initialisez le serveur et connectez-vous à MongoDB en utilisant mongoURI du fichier de configuration
    server = app.listen(5000);
    await mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    // Fermez la connexion MongoDB et arrêtez le serveur après les tests
    await mongoose.connection.close();
    server.close();
});

describe('Reservation API', () => {
    it('should create a new reservation', async () => {
        const existingUser = await User.findOne(); // Supposons qu'il y a un utilisateur existant

        const res = await request(app)
            .post('/api/reservations')
            .send({
                user: existingUser._id.toString(), // Assurez-vous que l'ID de l'utilisateur est converti en chaîne
                startTime: '2024-07-03T10:00:00Z',
                endTime: '2024-07-03T12:00:00Z',
                checkIn: '2024-07-03T10:00:00Z',
                // Ajoutez d'autres champs requis ici
            })
            .set('Accept', 'application/json');

        // Vérifiez la réponse
        expect(res.status).toBe(201); // Assurez-vous que le statut de la réponse est 201
        // Vous pouvez également vérifier d'autres détails de la réponse si nécessaire
    });
});
















