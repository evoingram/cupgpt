const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const createSearchRouter = require('../searchRouter');
const { generateKnexClient } = require("../../../utils/create_database");
const searchModel = require('../searchModel');
const { handleSearchQuery } = require('../../../utils/search_service');

const knex = generateKnexClient('test');

// Create an instance of the express app
const app = express();
app.use(bodyParser.json());
app.use('/search', createSearchRouter(knex, searchModel));

jest.mock('../../../utils/search_service');
jest.mock('../searchModel');

describe('searchRouter', () => {
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
    });

    afterAll(async () => {
        console.log('Destroying database connection');
        // Destroy the connection to the database
        await knex.destroy();
    });

    describe('GET /search/content', () => {
        it('should search for content by topic', async () => {
            const mockResults = [{ id: 1, description: 'Content for topic' }];
            searchModel.searchContentByTopic.mockResolvedValue(mockResults);

            const response = await request(app).get('/search/content').query({ topic: 'Default topic' });
            console.log('Response:', response.body);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResults);
        });

        it('should return 404 if topic is not found', async () => {
            searchModel.searchContentByTopic.mockResolvedValue(null);

            const response = await request(app).get('/search/content').query({ topic: 'Nonexistent topic' });
            console.log('Response:', response.body);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Topic not found');
        });
    });

    describe('POST /search/query', () => {
        it('should search for content by query', async () => {
            const mockResults = { results: ['result1', 'result2'], rawOutput: 'raw output' };
            handleSearchQuery.mockResolvedValue(mockResults);

            const response = await request(app).post('/search/query').send({ query: 'search term', options: {} });
            console.log('Response:', response.body);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResults);
        });

        it('should handle errors and return 500 status code', async () => {
            handleSearchQuery.mockRejectedValue(new Error('Search failed'));

            const response = await request(app).post('/search/query').send({ query: 'search term', options: {} });
            console.log('Response:', response.body);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Failed to fetch data');
        });
    });
});
