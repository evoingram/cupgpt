const request = require('supertest');
const app = require('../index'); // Adjust the path as needed
require('dotenv').config();

describe('GET /', () => {
    it('should return a welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Welcome to CupGPT: A Coding Monkey Wizard');
    });
});

/*
Test Cases:
Existing test case: Should return a welcome message.
Additional test cases that cover general application behavior not specific to any module.
 */