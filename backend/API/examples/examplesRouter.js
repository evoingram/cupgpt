const express = require('express');
const { validateExampleData } = require('./examplesMiddleware');

const createExamplesRouter = (knex) => {
    const router = express.Router();

    // Create a new example for content
    router.post('/', validateExampleData, async (req, res) => {
        const { content_id, language, example } = req.body;
        console.log(`POST /examples request: ${req.method} ${req.originalUrl} with content_id ${content_id} and language ${language} and example ${example}`);
        try {
            const [id] = await knex('examples').insert({
                content_id,
                language,
                example,
                tsv_example: knex.raw("to_tsvector('english', ?)", [example])
            }).returning('id');
            res.status(201).json({ id });
        } catch (error) {
            console.error('Error creating example:', error);
            res.status(500).json({ error: 'Failed to insert example', details: error.message });
        }
    });

    // Retrieve a list of all examples
    router.get('/', async (req, res) => {
        try {
            console.log(`GET /examples request: ${req.method} ${req.originalUrl}`);
            const examples = await knex('examples').select('*');
            res.status(200).json(examples);
        } catch (error) {
            console.error('Error retrieving examples:', error);
            res.status(500).json({ error: 'Failed to retrieve examples', details: error.message });
        }
    });

    // Retrieve a specific example by ID
    router.get('/:id', async (req, res) => {
        const { id } = req.params;
        console.log(`GET /examples/${id} request: ${req.method} ${req.originalUrl}`);
        try {
            const example = await knex('examples').where({ id }).first();
            if (!example) {
                return res.status(404).json({ error: 'Example not found' });
            }
            res.status(200).json(example);
        } catch (error) {
            console.error(`Error retrieving example by ID (${id}):`, error);
            res.status(500).json({ error: 'Failed to retrieve example', details: error.message });
        }
    });

    // Update a specific example by ID
    router.put('/:id', validateExampleData, async (req, res) => {
        const { id } = req.params;
        const { content_id, language, example } = req.body;
        console.log(`PUT /examples/${id} request: ${req.method} ${req.originalUrl} with contentId ${content_id} and language ${language} and example ${example}`);
        try {
            const count = await knex('examples').where({ id }).update({
                content_id,
                language,
                example,
                tsv_example: knex.raw("to_tsvector('english', ?)", [example])
            });
            if (count === 0) {
                return res.status(404).json({ error: 'Example not found' });
            }
            res.status(200).json({ message: 'Example updated successfully' });
        } catch (error) {
            console.error(`Error updating example by ID (${id}):`, error);
            res.status(500).json({ error: 'Failed to update example', details: error.message });
        }
    });

    // Delete a specific example by ID
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        console.log(`DELETE /examples/${id} request: ${req.method} ${req.originalUrl}`);
        try {
            const count = await knex('examples').where({ id }).del();
            if (count === 0) {
                return res.status(404).json({ error: 'Example not found' });
            }
            res.status(200).json({ message: 'Example deleted successfully' });
        } catch (error) {
            console.error(`Error deleting example by ID (${id}):`, error);
            res.status(500).json({ error: 'Failed to delete example', details: error.message });
        }
    });

    return router;
};

module.exports = createExamplesRouter;
