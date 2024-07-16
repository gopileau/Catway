const path = require('path');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require(path.resolve(__dirname, '../server'));
const User = require('../models/User');
const Catway = require('../models/Catway');
const fs = require('fs');
const chai = require('chai');
const expect = chai.expect;


const configPath = path.resolve(__dirname, '../config/test.json');
const configFile = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configFile);

let server;

before(async function() {
    this.timeout(20000); 
    try {
        console.log("Starting server...");
        server = app.listen(5000);
        console.log("Connecting to MongoDB...");
        await mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error during setup:", err);
        throw err; 
    }
});

after(async function() {
    this.timeout(20000); 
    try {
        console.log("Closing MongoDB connection...");
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
        console.log("Stopping server...");
        server.close();
        console.log("Server stopped");
    } catch (err) {
        console.error("Error during teardown:", err);
        throw err; 
    }
});

describe('Reservation API', () => {
    it('should create a new reservation', async () => {
        let existingUser = await User.findOne();
        let existingCatway = await Catway.findOne();

        if (!existingUser) {
            existingUser = new User({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123'
            });
            await existingUser.save();
        }

        if (!existingCatway) {
            existingCatway = new Catway({
                name: 'Test Catway',
                catwayState: 'active',
                type: 'type1',
                catwayNumber: 1
            });
            await existingCatway.save();
        }

        const res = await request(app)
            .post('/api/reservations')
            .send({
                user: existingUser._id.toString(),
                startTime: '2024-07-03T10:00:00Z',
                endTime: '2024-07-03T12:00:00Z',
                checkIn: '2024-07-03T10:00:00Z',
                catway: existingCatway._id.toString(),
            })
            .set('Accept', 'application/json');

        console.log(res.body);

        expect(res.status).to.be.equal(201);
    });
});























