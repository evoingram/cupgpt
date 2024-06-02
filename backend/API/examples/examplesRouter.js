// backend/API/examples/examplesRouter.js
const express = require('express');
const router = express.Router();
const Examples = require('./examplesModel');

router.post('/', async (req, res) => {
    const { content_id, language, example } = req.body;
    try {
        const [id] = await Examples.addExample({
            content_id,
            language,
            example,
            tsv_example: db.raw("to_tsvector('english', ?)", [example])
        });
        res.status(201).json({ id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to insert example' });
    }
});

router.get('/', async (req, res) => {
    try {
        const examples = await Examples.getAllExamples();
        res.json(examples);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch examples' });
    }
});

module.exports = router;
