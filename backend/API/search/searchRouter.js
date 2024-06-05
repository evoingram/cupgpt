const express = require('express');
const { handleSearchQuery } = require('../../utils/search_service');
const createSearchRouter = (knex, searchModel) => {
    const router = express.Router();

    // Search for content by topic using GET
    router.get('/content', async (req, res) => {
        const { topic } = req.query;
        try {
            const results = await searchModel.searchContentByTopic(topic, knex);
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
        console.log('POST /search/query endpoint called');

        try {
            console.log('Received query:', query);
            const { results, rawOutput } = await handleSearchQuery(query, options, knex);
            console.log('Search results:', results);
            console.log('Generated raw output:', rawOutput);

            res.status(200).json({ results, rawOutput });
        } catch (error) {
            console.error('Error in POST /search/query endpoint:', error);
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    });

    return router;
};

module.exports = createSearchRouter;
