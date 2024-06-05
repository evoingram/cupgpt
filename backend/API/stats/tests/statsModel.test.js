const { generateKnexClient } = require("../../../utils/create_database");
const createStatsModel = require('../statsModel');

const knex = generateKnexClient('test');
const statsModel = createStatsModel(knex);

describe('statsModel', () => {
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

    describe('getTopicsCount', () => {
        it('should retrieve count of topics', async () => {
            const count = await statsModel.getTopicsCount();
            console.log('Topics count:', count);
            expect(count).toBeGreaterThan(0);
        });
    });

    describe('getContentCount', () => {
        it('should retrieve count of content items', async () => {
            const count = await statsModel.getContentCount();
            console.log('Content count:', count);
            expect(count).toBeGreaterThanOrEqual(0);
        });
    });

    describe('getExamplesCount', () => {
        it('should retrieve count of examples', async () => {
            const count = await statsModel.getExamplesCount();
            console.log('Examples count:', count);
            expect(count).toBeGreaterThanOrEqual(0);
        });
    });

    describe('error handling', () => {
        it('should handle errors when retrieving topics count', async () => {
            const mockKnex = jest.fn().mockImplementation(() => {
                throw new Error('Database error');
            });
            const mockStatsModel = createStatsModel(mockKnex);

            await expect(mockStatsModel.getTopicsCount()).rejects.toThrow('Database error');
        });

        it('should handle errors when retrieving content count', async () => {
            const mockKnex = jest.fn().mockImplementation(() => {
                throw new Error('Database error');
            });
            const mockStatsModel = createStatsModel(mockKnex);

            await expect(mockStatsModel.getContentCount()).rejects.toThrow('Database error');
        });

        it('should handle errors when retrieving examples count', async () => {
            const mockKnex = jest.fn().mockImplementation(() => {
                throw new Error('Database error');
            });
            const mockStatsModel = createStatsModel(mockKnex);

            await expect(mockStatsModel.getExamplesCount()).rejects.toThrow('Database error');
        });
    });
});
