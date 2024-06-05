const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const createStatsRouter = require('../statsRouter');
const { generateKnexClient } = require("../../../utils/create_database");

const knex = generateKnexClient('test');

// Create an instance of the express app
const app = express();
app.use(bodyParser.json());
app.use('/stats', createStatsRouter(knex));

describe('statsRouter', () => {
    beforeAll(async () => {
        console.log('Running migrations and seeds before all tests');
        await knex.migrate.latest();
        await knex.seed.run();
    });

    beforeEach(async () => {
        console.log('Clearing database tables before each test');
        await knex('examples').del();
        await knex('topic_relationships').del();
        await knex('content').del();
        await knex('topics').del();

        console.log('Checking topics table before insertion:');
        const topicsBefore = await knex('topics').select('*');
        console.log(topicsBefore);

        if (topicsBefore.length === 0) {
            console.log('Inserting default topic');
            await knex('topics').insert({ id: 1, name: 'Default topic' });
        }

        console.log('Checking topics table after insertion:');
        const topicsAfter = await knex('topics').select('*');
        console.log(topicsAfter);
    });

    afterAll(async () => {
        console.log('Destroying database connection');
        await knex.destroy();
    });

    describe('GET /stats/topics/count', () => {
        it('should retrieve topics count', async () => {
            const response = await request(app).get('/stats/topics/count');
            console.log('Response:', response.body);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('count');
        });
    });

    describe('GET /stats/content/count', () => {
        it('should retrieve content count', async () => {
            const response = await request(app).get('/stats/content/count');
            console.log('Response:', response.body);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('count');
        });
    });

    describe('GET /stats/examples/count', () => {
        it('should retrieve examples count', async () => {
            const response = await request(app).get('/stats/examples/count');
            console.log('Response:', response.body);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('count');
        });
    });
});
