const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const createContentsRouter = require('../contentsRouter');
const {generateKnexClient} = require("../../../utils/create_database");
const knex = generateKnexClient('test');

// Create an instance of the express app
const app = express();
app.use(bodyParser.json());
app.use('/contents', createContentsRouter(knex));

describe('contentsRouter', () => {
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

    describe('POST /contents', () => {
        it('should create new content', async () => {
            const response = await request(app)
                .post('/contents')
                .send({ topic_id: 1, description: 'New content' });
            console.log('Response:', response.body);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
        });
    });

    describe('GET /contents', () => {
        it('should retrieve all content items', async () => {
            const response = await request(app).get('/contents');
            console.log('Response:', response.body);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('GET /contents/:id', () => {
        it('should retrieve specific content by ID', async () => {
            const [id] = await knex('content').insert({ topic_id: 1, description: 'Test content' }).returning('id');
            const response = await request(app).get(`/contents/${id}`);
            console.log('Response:', response.body);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', id);
        });
    });

    describe('PUT /contents/:id', () => {
        it('should update specific content by ID', async () => {
            const [id] = await knex('content').insert({ topic_id: 1, description: 'Old content' }).returning('id');
            const response = await request(app)
                .put(`/contents/${id}`)
                .send({ topic_id: 1, description: 'Updated content' });
            console.log('Response:', response.body);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Content updated successfully');
        });
    });

    describe('DELETE /contents/:id', () => {
        it('should delete specific content by ID', async () => {
            const [id] = await knex('content').insert({ topic_id: 1, description: 'Content to be deleted' }).returning('id');
            const response = await request(app).delete(`/contents/${id}`);
            console.log('Response:', response.body);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Content deleted successfully');
        });
    });

    describe('GET /contents/search', () => {
        beforeEach(async () => {
            console.log('Clearing database tables before each test');
            // Clear the tables before each test
            await knex('examples').del();
            await knex('topic_relationships').del();
            await knex('content').del();
            await knex('topics').del();

            // Reset sequences
            await knex.raw('ALTER SEQUENCE examples_id_seq RESTART WITH 1');
            await knex.raw('ALTER SEQUENCE content_id_seq RESTART WITH 1');
            await knex.raw('ALTER SEQUENCE topic_relationships_id_seq RESTART WITH 1');
            await knex.raw('ALTER SEQUENCE topics_id_seq RESTART WITH 1');

            console.log('Checking topics table before insertion:');
            const topicsBefore = await knex('topics').select('*');
            console.log(topicsBefore);

            // Insert default topic to avoid duplicate primary key error
            if (topicsBefore.length === 0) {
                console.log('Inserting default topic');
                await knex('topics').insert({ id: 1, name: 'Default topic' });
            }

            console.log('Checking topics table after insertion:');
            const topicsAfter = await knex('topics').select('*');
            console.log(topicsAfter);
        });

        it('should search for content by topic', async () => {
            const topicData = { name: 'Existing topic' };
            let topicId;
            let isInserted = false;

            while (!isInserted) {
                try {
                    [topicId] = await knex('topics').insert(topicData).returning('id');
                    isInserted = true;
                } catch (error) {
                    if (error.code === '23505') { // Unique constraint violation
                        topicData.name = `Existing topic ${Math.floor(Math.random() * 10000)}`;
                    } else {
                        throw error;
                    }
                }
            }

            console.log(`Inserted topic ID ${topicId} with topicData.name ${topicData.name}`);
            await knex('content').insert({ topic_id: topicId, description: 'Content for topic' });

            const allContents = await knex('content').select('*');
            console.log('All contents:', allContents);

            const response = await request(app).get('/contents/search').query({ topic: topicData.name });
            console.log('Response:', response.body);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
        });



    });
});
