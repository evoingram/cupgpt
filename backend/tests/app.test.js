const request = require('supertest');
const app = require('../index');
require('dotenv').config();

describe('GET /', () => {
    it('should return a welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Welcome to CupGPT: A Coding Monkey Wizard');
    });
});
