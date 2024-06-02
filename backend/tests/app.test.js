const request = require('supertest');
const app = require('../index'); // Adjust the path as needed
require('dotenv').config();


const TESTING_PORT = process.env.TESTING_PORT || 3005; // Use TESTING_PORT from .env or default to 3001

describe('GET /', () => {
    it('should return a welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Welcome to CupGPT: A Coding Monkey Wizard');
    });
});
