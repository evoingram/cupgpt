const express = require('express');
const { validateTopicData, validateLinkData } = require('./topicsMiddleware');

const createTopicsRouter = (knex) => {
    const router = express.Router();

    // Create a new topic
    router.post('/', validateTopicData, async (req, res) => {
        console.log('POST /topics');
        const { name } = req.body;
        try {
            const [id] = await knex('topics').insert({ name }).returning('id');
            res.status(201).json({ id });
        } catch (error) {
            console.error('Error creating topic:', error);
            res.status(500).json({ error: 'Failed to insert topic', details: error.message });
        }
    });

    // Retrieve a list of all topics
    router.get('/', async (req, res) => {
        console.log('GET /topics');
        try {
            const topics = await knex('topics').select('*');
            res.status(200).json(topics);
        } catch (error) {
            console.error('Error retrieving topics:', error);
            res.status(500).json({ error: 'Failed to retrieve topics', details: error.message });
        }
    });

    // Retrieve a specific topic by ID
    router.get('/:id', async (req, res) => {
        const { id } = req.params;
        console.log(`GET /topics/${id}`);
        try {
            const topic = await knex('topics').where({ id }).first();
            if (!topic) {
                return res.status(404).json({ error: 'Topic not found' });
            }
            res.status(200).json(topic);
        } catch (error) {
            console.error(`Error retrieving topic by ID (${id}):`, error);
            res.status(500).json({ error: 'Failed to retrieve topic', details: error.message });
        }
    });

    // Update a specific topic by ID
    router.put('/:id', validateTopicData, async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        console.log(`PUT /topics/${id}`);
        try {
            const count = await knex('topics').where({ id }).update({ name });
            if (count === 0) {
                return res.status(404).json({ error: 'Topic not found' });
            }
            res.status(200).json({ message: 'Topic updated successfully' });
        } catch (error) {
            console.error(`Error updating topic by ID (${id}):`, error);
            res.status(500).json({ error: 'Failed to update topic', details: error.message });
        }
    });

    // Delete a specific topic by ID
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        console.log(`DELETE /topics/${id}`);
        try {
            const count = await knex('topics').where({ id }).del();
            if (count === 0) {
                return res.status(404).json({ error: 'Topic not found' });
            }
            res.status(200).json({ message: 'Topic deleted successfully' });
        } catch (error) {
            console.error(`Error deleting topic by ID (${id}):`, error);
            res.status(500).json({ error: 'Failed to delete topic', details: error.message });
        }
    });

    // Link parent and child topics
    router.post('/link', validateLinkData, async (req, res) => {
        const { parent_topic_id, child_topic_id } = req.body;
        console.log('POST /topics/link');
        try {
            await knex('topic_relationships').insert({ parent_topic_id, child_topic_id });
            res.status(201).json({ message: 'Topics linked successfully' });
        } catch (error) {
            console.error('Error linking topics:', error);
            res.status(500).json({ error: 'Failed to link topics', details: error.message });
        }
    });

    return router;
};

module.exports = createTopicsRouter;
