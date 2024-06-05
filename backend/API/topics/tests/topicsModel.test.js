
const {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopicById,
    deleteTopicById,
    linkTopics,
} = require('../topicsModel');
const { generateKnexClient } = require("../../../utils/create_database");

describe('topicsModel', () => {
    const knex = generateKnexClient('test');

    beforeAll(async () => {
        console.log('Running migrations and seeds before all tests');
        // Run migrations and seeds to set up the database for tests
        await knex.migrate.latest();
        await knex.seed.run();
    });

    afterAll(async () => {
        console.log('Destroying database connection');
        // Destroy the connection to the database
        await knex.destroy();
    });

    beforeEach(async () => {
        console.log('Clearing database tables before each test');
        // Clear the tables before each test
        await knex('examples').del();
        await knex('topic_relationships').del();
        await knex('content').del();
        await knex('topics').del();
    });

    describe('getAllTopics', () => {
        it('should retrieve all topics', async () => {
            await createTopic({ name: 'Test topic' }, knex);
            const topics = await getAllTopics(knex);
            expect(topics).toBeInstanceOf(Array);
            expect(topics.length).toBeGreaterThan(0);
        });

        it('should retrieve all topics when the database is empty', async () => {
            const topics = await getAllTopics(knex);
            expect(topics).toEqual([]);
        });
    });

    describe('getTopicById', () => {
        it('should retrieve a specific topic by ID', async () => {
            const [id] = await createTopic({ name: 'Test topic' }, knex);
            const topic = await getTopicById(id, knex);
            expect(topic).toHaveProperty('id', id);
            expect(topic).toHaveProperty('name', 'Test topic');
        });

        it('should return undefined when retrieving a non-existent topic by ID', async () => {
            const topic = await getTopicById(99999, knex);
            expect(topic).toBeUndefined();
        });
    });

    describe('createTopic', () => {
        it('should insert a new topic', async () => {
            const data = { name: 'New topic' };
            const [id] = await createTopic(data, knex);
            expect(id).toBeDefined();
            const topic = await getTopicById(id, knex);
            expect(topic).toHaveProperty('name', 'New topic');
        });

        it('should throw an error when inserting a new topic with missing fields', async () => {
            const data = {};
            await expect(createTopic(data, knex)).rejects.toThrow();
        });
    });

    describe('updateTopicById', () => {
        it('should update a topic', async () => {
            const [id] = await createTopic({ name: 'Old topic' }, knex);
            await updateTopicById(id, { name: 'Updated topic' }, knex);
            const topic = await getTopicById(id, knex);
            expect(topic).toHaveProperty('name', 'Updated topic');
        });

        it('should return 0 when updating a non-existent topic by ID', async () => {
            const count = await updateTopicById(99999, { name: 'Non-existent topic' }, knex);
            expect(count).toBe(0);
        });
    });

    describe('deleteTopicById', () => {
        it('should delete a topic', async () => {
            const [id] = await createTopic({ name: 'Topic to be deleted' }, knex);
            const count = await deleteTopicById(id, knex);
            expect(count).toBe(1);
            const topic = await getTopicById(id, knex);
            expect(topic).toBeUndefined();
        });

        it('should return 0 when deleting a non-existent topic by ID', async () => {
            const count = await deleteTopicById(99999, knex);
            expect(count).toBe(0);
        });
    });

    describe('linkTopics', () => {
        it('should link two topics', async () => {
            const [parentId] = await createTopic({ name: 'Parent topic' }, knex);
            const [childId] = await createTopic({ name: 'Child topic' }, knex);
            await linkTopics(parentId, childId, knex);
            const links = await knex('topic_relationships').where({ parent_topic_id: parentId, child_topic_id: childId });
            expect(links.length).toBe(1);
        });

        it('should throw an error when linking non-existent topics', async () => {
            await expect(linkTopics(99999, 88888, knex)).rejects.toThrow();
        });
    });
});
