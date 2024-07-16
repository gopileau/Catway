const path = require('path');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require(path.resolve(__dirname, '../server'));
const User = require('../models/User');
const Catway = require('../models/Catway'); // Assurez-vous d'importer votre modèle Catway
const fs = require('fs');
const chai = require('chai');
const expect = chai.expect;

// Chargez le fichier de configuration JSON depuis config/test.json
const configPath = path.resolve(__dirname, '../config/test.json'); // Utilisez le chemin correct vers test.json
const configFile = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configFile);

let server;

before(async () => {
    // Initialisez le serveur et connectez-vous à MongoDB en utilisant mongoURI du fichier de configuration
    server = app.listen(5000);
    await mongoose.connect(config.mongoURI);
});

after(async () => {
    // Fermez la connexion MongoDB et arrêtez le serveur après les tests
    await mongoose.connection.close();
    server.close();
});

describe('Reservation API', () => {
    it('should create a new reservation', async () => {
        let existingUser = await User.findOne();
        let existingCatway = await Catway.findOne(); // Cherchez un catway existant

        if (!existingUser) {
            existingUser = new User({
                // Ajoutez les détails de l'utilisateur nécessaires pour votre schéma
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123'
            });
            await existingUser.save();
        }

        if (!existingCatway) {
            existingCatway = new Catway({
                // Ajoutez les détails du catway nécessaires pour votre schéma
                name: 'Test Catway',
                catwayState: 'active', // Exemple de valeur pour catwayState
                type: 'type1', // Utilisez une valeur valide pour type
                catwayNumber: 1 // Exemple de valeur pour catwayNumber
            });
            await existingCatway.save();
        }

        const res = await request(app)
            .post('/api/reservations')
            .send({
                user: existingUser._id.toString(), // Assurez-vous que l'ID de l'utilisateur est converti en chaîne
                startTime: '2024-07-03T10:00:00Z',
                endTime: '2024-07-03T12:00:00Z',
                checkIn: '2024-07-03T10:00:00Z',
                catway: existingCatway._id.toString(), // Utilisez un ObjectId valide pour le catway
                // Ajoutez d'autres champs requis ici
            })
            .set('Accept', 'application/json');

        console.log(res.body); // Ajoutez ceci pour voir le message d'erreur

        // Vérifiez la réponse
        expect(res.status).to.be.equal(201); // Assurez-vous que le statut de la réponse est 201
        // Vous pouvez également vérifier d'autres détails de la réponse si nécessaire
    });
});






















