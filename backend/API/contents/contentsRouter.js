// backend/API/content/contentsRouter.js
const express = require('express');
const router = express.Router();
const Content = require('./contentsModel');

router.post('/', async (req, res) => {
    const { topic_id, description } = req.body;
    try {
        const [id] = await Content.addContent({
            topic_id,
            description,
            tsv_content: db.raw("to_tsvector('english', ?)", [description])
        });
        res.status(201).json({ id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to insert content' });
    }
});

router.get('/search', async (req, res) => {
    const { topic } = req.query;
    try {
        const parentId = await Content.findTopicByName(topic);
        if (!parentId) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        const results = await Content.searchContent(parentId.id);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search content' });
    }
});

module.exports = router;
