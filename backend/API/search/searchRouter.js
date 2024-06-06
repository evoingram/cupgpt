const express = require('express');
const router = express.Router();
const { handleSearchQuery } = require('../../utils/search_service');
const searchModel = require('./searchModel');

// Search for content by topic using GET
router.get('/content', async (req, res) => {
    const { topic } = req.query;
    console.log(`GET /search/content request: ${req.method} ${req.originalUrl} with topic ${topic}`);
    try {
        const results = await searchModel.searchContentByTopic(topic);
        if (!results) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        res.status(200).json(results);
    } catch (error) {
        console.error(`Error searching content by topic (${topic}):`, error);
        res.status(500).json({ error: 'Failed to search content', details: error.message });
    }
});

// Search for content by query using POST (newly added)
router.post('/query', async (req, res) => {
    const { query, options } = req.body;
    console.log(`POST /search/query request: ${req.method} ${req.originalUrl} with query ${query} and options ${JSON.stringify(options)}`);

    try {
        const { results, rawOutput } = await handleSearchQuery(query, options);
        console.log('Search results:', results);
        console.log('Generated raw output:', rawOutput);

        res.status(200).json({ results, rawOutput });
    } catch (error) {
        console.error('Error in POST /search/query endpoint:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = router;
