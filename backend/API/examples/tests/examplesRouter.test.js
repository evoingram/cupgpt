/*
Test Cases:
Test case for POST /examples: Should create new example.
Test case for GET /examples: Should retrieve all examples.
Test case for GET /examples/:id: Should retrieve specific example by ID.
Test case for PUT /examples/:id: Should update specific example by ID.
Test case for DELETE /examples/:id: Should delete specific example by ID.
 */

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const createExamplesRouter = require('../examplesRouter');
const { generateKnexClient } = require("../../../utils/create_database");
const knex = generateKnexClient('test');

// Create an instance of the express app
const app = express();
app.use(bodyParser.json());
app.use('/examples', createExamplesRouter(knex));

describe('examplesRouter', () => {
    beforeAll(async () => {
        console.log('Running migrations and seeds before all tests');
        // Run migrations and seeds to set up the database for tests
        await knex.migrate.latest();
        await knex.seed.run();
    });

    beforeEach(async () => {
        console.log('Clearing database tables before each test');
        // Clear the tables before each test
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

        if (topicsAfter.length === 1) {
            console.log('Inserting default content');
            await knex('content').insert({ id: 1, topic_id: 1, description: 'Default content' });
        }
    });

    afterAll(async () => {
        console.log('Destroying database connection');
        // Destroy the connection to the database
        await knex.destroy();
    });

    describe('POST /examples', () => {
        it('should create a new example', async () => {
            const response = await request(app)
                .post('/examples')
                .send({ content_id: 1, language: 'en', example: 'New example' });
            console.log('Response:', response.body);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
        });
    });

    describe('GET /examples', () => {
        it('should retrieve all examples', async () => {
            const response = await request(app).get('/examples');
            console.log('Response:', response.body);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('GET /examples/:id', () => {
        it('should retrieve a specific example by ID', async () => {
            const [id] = await knex('examples').insert({ content_id: 1, language: 'en', example: 'Test example' }).returning('id');
            const response = await request(app).get(`/examples/${id}`);
            console.log('Response:', response.body);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', id);
        });
    });

    describe('PUT /examples/:id', () => {
        it('should update a specific example by ID', async () => {
            const [id] = await knex('examples').insert({ content_id: 1, language: 'en', example: 'Old example' }).returning('id');
            const response = await request(app)
                .put(`/examples/${id}`)
                .send({ content_id: 1, language: 'en', example: 'Updated example' });
            console.log('Response:', response.body);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Example updated successfully');
        });
    });

    describe('DELETE /examples/:id', () => {
        it('should delete a specific example by ID', async () => {
            const [id] = await knex('examples').insert({ content_id: 1, language: 'en', example: 'Example to be deleted' }).returning('id');
            const response = await request(app).delete(`/examples/${id}`);
            console.log('Response:', response.body);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Example deleted successfully');
        });
    });
});
