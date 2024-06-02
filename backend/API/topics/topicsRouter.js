// backend/API/topics/topicsRouter.js
const express = require('express');
const router = express.Router();
const Topics = require('./topicsModel');

router.post('/', async (req, res) => {
    const { name } = req.body;
    try {
        const [id] = await Topics.addTopic({ name });
        res.status(201).json({ id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to insert topic' });
    }
});

router.post('/link', async (req, res) => {
    const { parent_topic_id, child_topic_id } = req.body;
    try {
        await Topics.linkTopics(parent_topic_id, child_topic_id);
        res.status(201).json({ message: 'Topics linked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to link topics' });
    }
});

module.exports = router;
