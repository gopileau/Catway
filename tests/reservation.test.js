const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path'); // Utilisez path pour résoudre le chemin
const app = require(path.resolve(__dirname, '../server'));

const Reservation = require('../models/Reservation');


// Si vous avez un fichier de configuration pour les variables d'environnement
require('dotenv').config();

describe('Reservation API', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    let token;

    beforeEach(async () => {
        // Connectez-vous et obtenez un token à utiliser pour les tests
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@example.com',
                password: 'password'
            });

        token = res.body.token;
    });

    it('should create a new reservation', async () => {
        const res = await request(app)
            .post('/api/catways/1/reservations')
            .send({
                catwayNumber: 1,
                clientName: 'John Doe',
                boatName: 'Sea Breeze',
                checkIn: '2024-06-01',
                checkOut: '2024-06-15'
            })
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
    });

    // Ajoutez des tests pour les autres routes
});
