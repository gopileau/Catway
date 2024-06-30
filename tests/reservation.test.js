const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const app = require(path.resolve(__dirname, '../server'));
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

describe('Reservation API', () => {
    let token;
    let server;

    beforeAll(async () => {
        console.log('Connecting to MongoDB:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        server = await app.listen(5000); 
    });

    afterAll(async () => {
        await mongoose.connection.close();
        server.close(); 
    });

    beforeEach(async () => {
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
});






