/*
Test Cases:
Any model tests if applicable.
 */const { generateKnexClient } = require("../../../utils/create_database");
const { searchContentByTopic } = require('../searchModel');

const knex = generateKnexClient('test');

describe('searchModel', () => {
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

    describe('searchContentByTopic', () => {
        it('should return content descriptions for a valid topic', async () => {
            await knex('topics').del();
            await knex('content').del();
            await knex('topic_relationships').del();

            console.log('Inserting valid topic');
            const [topicId] = await knex('topics').insert({ name: 'Valid topic' }).returning('id');
            console.log('Inserted topic ID:', topicId);

            console.log('Inserting content for valid topic');
            const [contentId] = await knex('content').insert({ topic_id: topicId, description: 'Content for topic' }).returning('id');
            console.log('Inserted content ID:', contentId);

            console.log('Inserting topic relationship');
            await knex('topic_relationships').insert({ parent_topic_id: topicId, child_topic_id: topicId });

            console.log('Checking topics table:');
            const topics = await knex('topics').select('*');
            console.log(topics);

            console.log('Checking content table:');
            const content = await knex('content').select('*');
            console.log(content);

            console.log('Checking topic relationships table:');
            const relationships = await knex('topic_relationships').select('*');
            console.log(relationships);

            const results = await searchContentByTopic('Valid topic', knex);
            console.log('Search results:', results);

            expect(results).toBeInstanceOf(Array);
            expect(results.length).toBeGreaterThan(0);
            expect(results[0]).toHaveProperty('description', 'Content for topic');
        });

        it('should return null for an invalid topic', async () => {
            await knex('topics').del();
            await knex('content').del();

            const results = await searchContentByTopic('Invalid topic', knex);
            console.log('Search results:', results);

            expect(results).toBeNull();
        });

        it('should handle errors gracefully', async () => {
            const mockKnex = jest.fn(() => {
                throw new Error('Database error');
            });

            try {
                await expect(searchContentByTopic('Valid topic', mockKnex)).rejects.toThrow('Database error');
            } finally {
                // No need to call knex.mockRestore() since we did not mock it directly
            }
        });
    });
});