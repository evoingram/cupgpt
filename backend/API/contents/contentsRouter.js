const express = require('express');
const { validateContentData } = require('./contentsMiddleware');

const createContentsRouter = (knex) => {
    const router = express.Router();

    // Create new content for a topic
    router.post('/', validateContentData, async (req, res) => {
        const { topic_id, description } = req.body;
        try {
            const [id] = await knex('content').insert({
                topic_id,
                description,
                tsv_content: knex.raw("to_tsvector('english', ?)", [description])
            }).returning('id');
            res.status(201).json({ id });
        } catch (error) {
            console.error('Error creating content:', error);
            res.status(500).json({ error: 'Failed to insert content', details: error.message });
        }
    });

    // Retrieve a list of all content items
    router.get('/', async (req, res) => {
        try {
            const content = await knex('content').select('*');
            res.status(200).json(content);
        } catch (error) {
            console.error('Error retrieving content:', error);
            res.status(500).json({ error: 'Failed to retrieve content', details: error.message });
        }
    });

    // Search for content by topic
    router.get('/search', async (req, res) => {
        const { topic } = req.query;
        try {
            const parentId = await knex('topics').where({ name: topic }).select('id').first();
            if (!parentId) {
                return res.status(404).json({ error: 'Topic not found' });
            }
            console.log(`topic = ${topic}`);
            const results = await knex('content')
                .where('topic_id', parentId.id)
                .select('description');

            res.status(200).json(results);
        } catch (error) {
            console.error('Error searching content by topic:', error);
            res.status(500).json({ error: 'Failed to search content', details: error.message });
        }
    });

    // Retrieve a specific content item by ID
    router.get('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const contentItem = await knex('content').where({ id }).first();
            if (!contentItem) {
                return res.status(404).json({ error: 'Content not found' });
            }
            res.status(200).json(contentItem);
        } catch (error) {
            console.error('Error retrieving content by ID:', error);
            res.status(500).json({ error: 'Failed to retrieve content', details: error.message });
        }
    });

    // Update a specific content item by ID
    router.put('/:id', validateContentData, async (req, res) => {
        const { id } = req.params;
        const { topic_id, description } = req.body;
        try {
            const count = await knex('content').where({ id }).update({
                topic_id,
                description,
                tsv_content: knex.raw("to_tsvector('english', ?)", [description])
            });
            if (count === 0) {
                return res.status(404).json({ error: 'Content not found' });
            }
            res.status(200).json({ message: 'Content updated successfully' });
        } catch (error) {
            console.error('Error updating content:', error);
            res.status(500).json({ error: 'Failed to update content', details: error.message });
        }
    });

    // Delete a specific content item by ID
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const count = await knex('content').where({ id }).del();
            if (count === 0) {
                return res.status(404).json({ error: 'Content not found' });
            }
            res.status(200).json({ message: 'Content deleted successfully' });
        } catch (error) {
            console.error('Error deleting content:', error);
            res.status(500).json({ error: 'Failed to delete content', details: error.message });
        }
    });

    return router;
};

module.exports = createContentsRouter;
