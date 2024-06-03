const express = require('express');
const router = express.Router();
const statsModel = require('./statsModel');

// Get count of topics
router.get('/topics/count', async (req, res) => {
    try {
        const count = await statsModel.getTopicsCount();
        res.status(200).json({count});
    } catch (error) {
        console.error('Error retrieving topics count:', error);
        res.status(500).json({error: 'Failed to retrieve topics count', details: error.message});
    }
});

// Get count of content items
router.get('/content/count', async (req, res) => {
    try {
        const count = await statsModel.getContentCount();
        res.status(200).json({count});
    } catch (error) {
        console.error('Error retrieving content count:', error);
        res.status(500).json({error: 'Failed to retrieve content count', details: error.message});
    }
});

// Get count of examples
router.get('/examples/count', async (req, res) => {
    try {
        const count = await statsModel.getExamplesCount();
        res.status(200).json({count});
    } catch (error) {
        console.error('Error retrieving examples count:', error);
        res.status(500).json({error: 'Failed to retrieve examples count', details: error.message});
    }
});

module.exports = router;
