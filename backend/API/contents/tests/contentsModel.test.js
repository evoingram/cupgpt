const {
    createContent,
    getAllContent,
    getContentById,
    updateContentById,
    deleteContentById,
    searchContentByTopic,
} = require('../contentsModel');
const {generateKnexClient} = require("../../../utils/create_database");
const {createTopic} = require("../../topics/topicsModel");

describe('contentsModel', () => {
    const knex = generateKnexClient('test');

    beforeAll(async () => {
        // Run migrations and seeds to set up the database for tests
        await knex.migrate.latest();
        await knex.seed.run();
    });

    afterAll(async () => {
        // Destroy the connection to the database
        await knex.destroy();
    });

    describe('getAllContent', () => {
        it('should retrieve all content items', async () => {
            const content = await getAllContent(knex);
            expect(content).toBeInstanceOf(Array);
        });

        it('should retrieve all content items when the database is empty', async () => {
            await knex('examples').del();
            await knex('content').del();
            const content = await getAllContent(knex);
            expect(content).toEqual([]);
        });
    });

    describe('getContentById', () => {
        it('should retrieve a specific content item by ID', async () => {
            const [id] = await createContent({ topic_id: 1, description: 'Test content' }, knex);
            const content = await getContentById(id, knex);
            expect(content).toHaveProperty('id', id);
            expect(content).toHaveProperty('description', 'Test content');
        });

        it('should return null when retrieving a non-existent content item by ID', async () => {
            const content = await getContentById(99999, knex);
            expect(content).toBeUndefined();
        });
    });

    describe('createContent', () => {
        it('should insert a new content item', async () => {
            const data = { topic_id: 1, description: 'New content' };
            const [id] = await createContent(data, knex);
            expect(id).toBeDefined();
            const content = await getContentById(id, knex);
            expect(content).toHaveProperty('description', 'New content');
        });

        it('should throw an error when inserting a new content item with missing fields', async () => {
            const data = { topic_id: 1 };
            await expect(createContent(data, knex)).rejects.toThrow('Missing required fields: topic_id, description');
        });
    });

    describe('updateContentById', () => {
        it('should update a content item', async () => {
            const [id] = await createContent({ topic_id: 1, description: 'Old content' }, knex);
            await updateContentById(id, { description: 'Updated content' }, knex);
            const content = await getContentById(id, knex);
            expect(content).toHaveProperty('description', 'Updated content');
        });

        it('should return 0 when updating a non-existent content item by ID', async () => {
            const count = await updateContentById(99999, { description: 'Non-existent content' }, knex);
            expect(count).toBe(0);
        });
    });

    describe('deleteContentById', () => {
        it('should delete a content item', async () => {
            const [id] = await createContent({ topic_id: 1, description: 'Content to be deleted' }, knex);
            const count = await deleteContentById(id, knex);
            expect(count).toBe(1);
            const content = await getContentById(id, knex);
            expect(content).toBeUndefined();
        });

        it('should return 0 when deleting a non-existent content item by ID', async () => {
            const count = await deleteContentById(99999, knex);
            expect(count).toBe(0);
        });
    });

    describe('searchContentByTopic', () => {
        beforeEach(async () => {
            // Clear the tables before each test
            await knex('examples').del();
            await knex('content').del();
            await knex('topics').del();
        });

        it('should search content by topic', async () => {
            const topicData = { name: 'Existing topic' };
            const [topicId] = await knex('topics').insert(topicData).returning('id');
            console.log('Inserted topicId:', topicId);
            const data = { topic_id: topicId, description: 'Content for topic' };
            await createContent(data, knex);
            const results = await searchContentByTopic('Existing topic', knex);
            console.log('Search results:', results);
            expect(results).toBeInstanceOf(Array);
            expect(results.length).toBeGreaterThan(0);
        });

        it('should return an empty array when searching content by a non-existent topic', async () => {
            const results = await searchContentByTopic('Non-existent topic', knex);
            console.log('Search results for non-existent topic:', results);
            expect(results).toBeInstanceOf(Array);
            expect(results.length).toBe(0);
        });

        it('should return an empty array when searching content by a topic with no related content', async () => {
            const topicData = { name: 'Existing topic with no content' };
            await knex('topics').insert(topicData);
            const results = await searchContentByTopic('Existing topic with no content', knex);
            console.log('Search results for topic with no content:', results);
            expect(results).toBeInstanceOf(Array);
            expect(results.length).toBe(0);
        });

        it('should handle special characters in the topic name', async () => {
            const topicData = { name: 'Special @topic#' };
            const [topicId] = await knex('topics').insert(topicData).returning('id');
            console.log('Inserted topicId with special characters:', topicId);
            const data = { topic_id: topicId, description: 'Content with special topic' };
            await createContent(data, knex);
            const results = await searchContentByTopic('Special @topic#', knex);
            console.log('Search results for special characters:', results);
            expect(results).toBeInstanceOf(Array);
            expect(results.length).toBeGreaterThan(0);
        });
    });

});
