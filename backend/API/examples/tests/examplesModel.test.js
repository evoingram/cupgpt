/*
Test Cases:
Test case for retrieving all examples.
Test case for retrieving a specific example by ID.
Test case for inserting a new example.
Test case for updating an example.
Test case for deleting an example.

 */
const {
    createExample,
    getAllExamples,
    getExampleById,
    updateExampleById,
    deleteExampleById
} = require('../examplesModel');
const {generateKnexClient} = require("../../../utils/create_database");
const knex = generateKnexClient('test');

describe('examplesModel', () => {

    beforeAll(async () => {
        // Run migrations and seeds to set up the database for tests
        await knex.migrate.latest();
        await knex.seed.run();
    });

    afterAll(async () => {
        // Destroy the connection to the database
        await knex.destroy();
    });

    describe('getAllExamples', () => {
        it('should retrieve all examples', async () => {
            const examples = await getAllExamples(knex);
            expect(examples).toBeInstanceOf(Array);
        });

        it('should retrieve all examples when the database is empty', async () => {
            await knex('examples').del();
            const examples = await getAllExamples(knex);
            expect(examples).toEqual([]);
        });
    });

    describe('getExampleById', () => {
        it('should retrieve a specific example by ID', async () => {
            const [id] = await createExample({ content_id: 1, language: 'en', example: 'Test example' }, knex);
            const example = await getExampleById(id, knex);
            expect(example).toHaveProperty('id', id);
            expect(example).toHaveProperty('example', 'Test example');
        });

        it('should return null when retrieving a non-existent example by ID', async () => {
            const example = await getExampleById(99999, knex);
            expect(example).toBeUndefined();
        });
    });

    describe('createExample', () => {
        it('should insert a new example', async () => {
            const data = { content_id: 1, language: 'en', example: 'New example' };
            const [id] = await createExample(data, knex);
            expect(id).toBeDefined();
            const example = await getExampleById(id, knex);
            expect(example).toHaveProperty('example', 'New example');
        });

        it('should throw an error when inserting a new example with missing fields', async () => {
            const data = { content_id: 1, language: 'en' };
            await expect(createExample(data, knex)).rejects.toThrow();
        });
    });

    describe('updateExampleById', () => {
        it('should update an example', async () => {
            const [id] = await createExample({ content_id: 1, language: 'en', example: 'Old example' }, knex);
            await updateExampleById(id, { example: 'Updated example' }, knex);
            const example = await getExampleById(id, knex);
            expect(example).toHaveProperty('example', 'Updated example');
        });

        it('should return 0 when updating a non-existent example by ID', async () => {
            const count = await updateExampleById(99999, { example: 'Non-existent example' }, knex);
            expect(count).toBe(0);
        });
    });

    describe('deleteExampleById', () => {
        it('should delete an example', async () => {
            const [id] = await createExample({ content_id: 1, language: 'en', example: 'Example to be deleted' }, knex);
            const count = await deleteExampleById(id, knex);
            expect(count).toBe(1);
            const example = await getExampleById(id, knex);
            expect(example).toBeUndefined();
        });

        it('should return 0 when deleting a non-existent example by ID', async () => {
            const count = await deleteExampleById(99999, knex);
            expect(count).toBe(0);
        });
    });
});
