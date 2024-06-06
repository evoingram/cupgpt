const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const createTopicsRouter = require('../topicsRouter');
const { generateKnexClient } = require("../../../utils/create_database");
const knex = generateKnexClient('test');

const app = express();
app.use(bodyParser.json());
app.use('/topics', createTopicsRouter(knex));

describe('topicsRouter', () => {
    beforeAll(async () => {
        console.log('Running migrations and seeds before all tests');
        await knex.migrate.latest();
        await knex.seed.run();
    });

    beforeEach(async () => {
        console.log('Clearing database tables before each test');
        await knex('topic_relationships').del();
        await knex('examples').del();
        await knex('content').del();
        await knex('topics').del();

        console.log('Inserting default topic');
        await knex('topics').insert({ name: 'Default topic' });
    });

    afterAll(async () => {
        console.log('Destroying database connection');
        await knex.destroy();
    });

    describe('POST /topics', () => {
        it('should create a new topic', async () => {
            const response = await request(app)
                .post('/topics')
                .send({ name: 'New topic' });
            console.log('Response:', response.body);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
        });
    });

    describe('GET /topics', () => {
        it('should retrieve all topics', async () => {
            const response = await request(app).get('/topics');
            console.log('Response:', response.body);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('GET /topics/:id', () => {
        it('should retrieve a specific topic by ID', async () => {
            const [id] = await knex('topics').insert({ name: 'Test topic' }).returning('id');
            const response = await request(app).get(`/topics/${id}`);
            console.log('Response:', response.body);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', id);
        });
    });

    describe('PUT /topics/:id', () => {
        it('should update a specific topic by ID', async () => {
            const [id] = await knex('topics').insert({ name: 'Old topic' }).returning('id');
            const response = await request(app)
                .put(`/topics/${id}`)
                .send({ name: 'Updated topic' });
            console.log('Response:', response.body);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Topic updated successfully');
        });
    });

    describe('DELETE /topics/:id', () => {
        it('should delete a specific topic by ID', async () => {
            const [id] = await knex('topics').insert({ name: 'Topic to be deleted' }).returning('id');
            const response = await request(app).delete(`/topics/${id}`);
            console.log('Response:', response.body);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Topic deleted successfully');
        });
    });

    describe('POST /topics/link', () => {
        it('should link parent and child topics', async () => {
            const [parentId] = await knex('topics').insert({ name: 'Parent topic' }).returning('id');
            const [childId] = await knex('topics').insert({ name: 'Child topic' }).returning('id');
            const response = await request(app)
                .post('/topics/link')
                .send({ parent_topic_id: parentId, child_topic_id: childId });
            console.log('Response:', response.body);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Topics linked successfully');
        });
    });
});
